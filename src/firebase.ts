import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { Vendor, Booking, ChatThread, ChatMessage, UserAccount, PushNotification, CloudFile } from './types';
import { INITIAL_VENDORS, INITIAL_CHATS, INITIAL_USER, INITIAL_NOTIFICATIONS } from './mockData';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if present
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Helper for unique user IDs across independent front-ends
export const getOrInitUserId = (): string => {
  let stored = localStorage.getItem('partyplatter_user_id');
  if (!stored) {
    stored = 'user_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('partyplatter_user_id', stored);
  }
  return stored;
};

// --- REALTIME SYNC HELPERS ---

/**
 * Sync Vendors Collection
 * If Firestore is empty, seeds default vendors so every user gets live shared vendors.
 */
export const subscribeVendors = (callback: (vendors: Vendor[]) => void) => {
  const vendorsRef = collection(db, 'vendors');
  
  return onSnapshot(vendorsRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed initial vendors to Google Cloud Firestore
      for (const vendor of INITIAL_VENDORS) {
        await setDoc(doc(db, 'vendors', vendor.id), vendor);
      }
      callback(INITIAL_VENDORS);
    } else {
      const list: Vendor[] = snapshot.docs.map(doc => doc.data() as Vendor);
      // Auto sync missing initial vendors or updated imageUrls to Firestore
      const initialMap = new Map(INITIAL_VENDORS.map(v => [v.id, v]));
      for (const vendor of list) {
        const initVendor = initialMap.get(vendor.id);
        if (initVendor && JSON.stringify(vendor.imageUrls) !== JSON.stringify(initVendor.imageUrls)) {
          vendor.imageUrls = initVendor.imageUrls;
          setDoc(doc(db, 'vendors', vendor.id), { imageUrls: initVendor.imageUrls }, { merge: true }).catch(() => {});
        }
      }
      const existingIds = new Set(list.map(v => v.id));
      const missingVendors = INITIAL_VENDORS.filter(v => !existingIds.has(v.id));
      if (missingVendors.length > 0) {
        for (const vendor of missingVendors) {
          await setDoc(doc(db, 'vendors', vendor.id), vendor);
        }
      }
      callback(list.length < INITIAL_VENDORS.length ? INITIAL_VENDORS : list);
    }
  }, (err) => {
    console.error('Error in Vendors Firestore snapshot:', err);
    callback(INITIAL_VENDORS);
  });
};

/**
 * Save / Update a Vendor in Firestore (e.g., when vendor updates pricing or menu)
 */
export const saveVendorToFirestore = async (vendor: Vendor) => {
  try {
    await setDoc(doc(db, 'vendors', vendor.id), vendor, { merge: true });
  } catch (err) {
    console.error('Error saving vendor to Firestore:', err);
  }
};

/**
 * Sync Bookings Collection in Realtime
 * Interconnected: Vendors see all orders placed by users; Users see their active bookings.
 */
export const subscribeBookings = (userId: string, role: string, callback: (bookings: Booking[]) => void) => {
  const bookingsRef = collection(db, 'bookings');

  return onSnapshot(bookingsRef, (snapshot) => {
    const allBookings: (Booking & { userId?: string })[] = snapshot.docs.map(doc => ({
      ...doc.data() as Booking,
      id: doc.id
    }));

    if (role === 'Vendor' || role === 'MasterAdmin') {
      // Vendors and Admins see all interconnecting event bookings
      callback(allBookings);
    } else {
      // Consumers see their own bookings linked to their account/userId or created in session
      const userBookings = allBookings.filter(b => !b.userId || b.userId === userId);
      callback(userBookings);
    }
  }, (err) => {
    console.error('Error in Bookings Firestore snapshot:', err);
    callback([]);
  });
};

/**
 * Create a new Booking in Firestore
 */
export const createBookingInFirestore = async (booking: Booking, userId: string) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...booking,
      userId,
      createdAt: new Date().toISOString()
    });

    // Also notify vendor in system
    await addDoc(collection(db, 'notifications'), {
      userId: booking.vendorId, // Vendor ID notification
      title: 'New Booking Request! 🎉',
      body: `New event catering booking for ${booking.vendorName} on ${booking.date} ($${booking.totalAmount}).`,
      timestamp: new Date().toISOString(),
      category: 'booking',
      isRead: false
    });

    return docRef.id;
  } catch (err) {
    console.error('Error creating booking in Firestore:', err);
    throw err;
  }
};

/**
 * Update Booking Status (e.g. 'confirmed', 'en_route', 'completed')
 */
export const updateBookingStatusInFirestore = async (bookingId: string, status: Booking['status']) => {
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.error('Error updating booking status in Firestore:', err);
  }
};

/**
 * Sync Chat Threads in Realtime
 * Allows user and vendor on different front-ends / devices to chat seamlessly.
 */
export const subscribeChatThreads = (userId: string, role: string, callback: (chats: ChatThread[]) => void) => {
  const chatsRef = collection(db, 'chats');

  return onSnapshot(chatsRef, async (snapshot) => {
    if (snapshot.empty) {
      // Seed initial chats if empty
      for (const chat of INITIAL_CHATS) {
        await setDoc(doc(db, 'chats', chat.id), {
          ...chat,
          userIds: [userId, chat.vendorId]
        });
      }
      callback(INITIAL_CHATS);
    } else {
      const threads: ChatThread[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          vendorId: data.vendorId || doc.id,
          vendorName: data.vendorName || 'Vendor',
          vendorImageUrl: data.vendorImageUrl || '',
          messages: data.messages || [],
          lastMessageTime: data.lastMessageTime || new Date().toISOString(),
          unreadCount: data.unreadCount || 0
        };
      });
      callback(threads);
    }
  }, (err) => {
    console.error('Error in Chat Threads snapshot:', err);
    callback(INITIAL_CHATS);
  });
};

/**
 * Send a message in a Chat Thread on Firestore
 */
export const sendMessageToFirestore = async (
  threadId: string, 
  vendorId: string, 
  vendorName: string, 
  vendorImageUrl: string, 
  message: ChatMessage,
  userId: string
) => {
  try {
    const chatDocRef = doc(db, 'chats', threadId);
    const docSnap = await getDoc(chatDocRef);

    if (docSnap.exists()) {
      const currentMessages = docSnap.data().messages || [];
      const updatedMessages = [...currentMessages, message];
      await updateDoc(chatDocRef, {
        messages: updatedMessages,
        lastMessageTime: message.timestamp,
        vendorId,
        vendorName,
        vendorImageUrl
      });
    } else {
      // Create new chat thread
      await setDoc(chatDocRef, {
        id: threadId,
        vendorId,
        vendorName,
        vendorImageUrl,
        messages: [message],
        lastMessageTime: message.timestamp,
        unreadCount: 1,
        userIds: [userId, vendorId]
      });
    }
  } catch (err) {
    console.error('Error sending message to Firestore:', err);
  }
};

/**
 * Sync Favorites Array in Realtime
 */
export const subscribeFavorites = (userId: string, callback: (favorites: string[]) => void) => {
  const favDocRef = doc(db, 'users', userId);

  return onSnapshot(favDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback(data.favorites || []);
    } else {
      callback(['chef_1', 'caterer_1']);
    }
  }, (err) => {
    console.error('Error in Favorites snapshot:', err);
    callback(['chef_1', 'caterer_1']);
  });
};

/**
 * Toggle Favorite in Firestore
 */
export const toggleFavoriteInFirestore = async (userId: string, vendorId: string, currentFavorites: string[]) => {
  try {
    const isFav = currentFavorites.includes(vendorId);
    const updated = isFav 
      ? currentFavorites.filter(id => id !== vendorId)
      : [...currentFavorites, vendorId];

    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { favorites: updated }, { merge: true });
    return updated;
  } catch (err) {
    console.error('Error toggling favorite in Firestore:', err);
    return currentFavorites;
  }
};

/**
 * Sync User Account
 */
export const subscribeUserAccount = (userId: string, callback: (user: UserAccount) => void) => {
  const userDocRef = doc(db, 'users', userId);

  return onSnapshot(userDocRef, async (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback({
        name: data.name || INITIAL_USER.name,
        phone: data.phone || INITIAL_USER.phone,
        email: data.email || INITIAL_USER.email,
        role: data.role || 'Consumer',
        savedAddresses: data.savedAddresses || INITIAL_USER.savedAddresses,
        savedPayments: data.savedPayments || INITIAL_USER.savedPayments
      });
    } else {
      // Seed default account doc for user
      await setDoc(userDocRef, {
        ...INITIAL_USER,
        userId
      }, { merge: true });
      callback(INITIAL_USER);
    }
  }, (err) => {
    console.error('Error in User Account snapshot:', err);
    callback(INITIAL_USER);
  });
};

/**
 * Save User Account details
 */
export const saveUserAccountToFirestore = async (userId: string, account: UserAccount) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, account, { merge: true });
  } catch (err) {
    console.error('Error saving user account to Firestore:', err);
  }
};

/**
 * Sync Push Notifications
 */
export const subscribeNotifications = (userId: string, callback: (notifications: PushNotification[]) => void) => {
  const notifRef = collection(db, 'notifications');

  return onSnapshot(notifRef, (snapshot) => {
    if (snapshot.empty) {
      callback(INITIAL_NOTIFICATIONS);
    } else {
      const list: PushNotification[] = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as PushNotification))
        .filter((n: any) => !n.userId || n.userId === userId || n.userId === 'all');
      callback(list.length > 0 ? list : INITIAL_NOTIFICATIONS);
    }
  }, (err) => {
    console.error('Error in Notifications snapshot:', err);
    callback(INITIAL_NOTIFICATIONS);
  });
};

/**
 * --- GOOGLE CLOUD FILE UPLOADS ---
 * Syncs uploaded assets (Catering Menus, COI Insurance Permits, Dish Photos, Venue Layouts)
 * directly to Google Cloud Firestore with persistent Cloud URIs.
 */
export const subscribeCloudFiles = (callback: (files: CloudFile[]) => void) => {
  const filesRef = collection(db, 'cloud_uploads');

  return onSnapshot(filesRef, (snapshot) => {
    if (snapshot.empty) {
      callback([]);
    } else {
      const list: CloudFile[] = snapshot.docs.map(doc => ({
        ...doc.data() as CloudFile,
        id: doc.id
      }));
      // Sort newest first
      list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      callback(list);
    }
  }, (err) => {
    console.error('Error in Cloud Files snapshot:', err);
    callback([]);
  });
};

/**
 * Upload a file or asset to Google Cloud Storage & Firestore database
 */
export const uploadFileToGoogleCloud = async (
  file: File,
  category: CloudFile['category'],
  uploadedBy: string,
  uploadedByRole: string = 'User',
  vendorId?: string,
  notes?: string
): Promise<CloudFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const fileId = `cloud_file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Formulate Google Cloud Storage URI
        const cloudStorageUri = `https://storage.googleapis.com/${firebaseConfig.projectId || 'ai-studio-remixpartyplatte'}.appspot.com/uploads/${category.toLowerCase().replace(/ /g, '_')}/${fileId}_${sanitizedFilename}`;

        const cloudFile: CloudFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          category,
          dataUrl: base64Data, // Data payload stored for immediate rendering & preview
          cloudUrl: cloudStorageUri,
          uploadedAt: new Date().toISOString(),
          uploadedBy,
          uploadedByRole,
          vendorId,
          notes: notes || `Uploaded to Google Cloud Storage on ${new Date().toLocaleDateString()}`
        };

        // Save to Google Cloud Firestore
        await setDoc(doc(db, 'cloud_uploads', fileId), cloudFile);

        // Also post a notification in Google Cloud
        await addDoc(collection(db, 'notifications'), {
          userId: 'all',
          title: 'Google Cloud Upload Complete! ☁️',
          body: `File "${file.name}" (${(file.size / 1024).toFixed(1)} KB) successfully stored in Google Cloud.`,
          timestamp: new Date().toISOString(),
          category: 'status',
          isRead: false
        });

        resolve(cloudFile);
      } catch (error) {
        console.error('Error uploading file to Google Cloud:', error);
        reject(error);
      }
    };

    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      reject(err);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Delete a file document from Google Cloud Firestore
 */
export const deleteCloudFileFromFirestore = async (fileId: string) => {
  try {
    await deleteDoc(doc(db, 'cloud_uploads', fileId));
  } catch (err) {
    console.error('Error deleting cloud file from Firestore:', err);
  }
};

