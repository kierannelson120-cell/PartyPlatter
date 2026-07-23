import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, ShoppingBag, Sparkles, MapPin, Search, Star, 
  MessageSquare, Calendar as CalendarIcon, ChevronRight, Info, Clock, Check, Bell, Cloud, Users, RefreshCw, X, Upload
} from 'lucide-react';

import PhoneFrame from './components/PhoneFrame';
import Drawer from './components/Drawer';
import NotificationCenter from './components/NotificationCenter';
import Logo from './components/Logo';
import PlatterAI from './components/PlatterAI';
import VendorPage from './components/VendorPage';
import VendorPortal from './components/VendorPortal';
import ChatHub from './components/ChatHub';
import AccountView from './components/AccountView';
import CartCheckout from './components/CartCheckout';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import FavoritesView from './components/FavoritesView';
import CloudUploadModal from './components/CloudUploadModal';

import { 
  INITIAL_VENDORS, INITIAL_USER, INITIAL_CHATS, INITIAL_NOTIFICATIONS 
} from './mockData';
import { 
  Vendor, UserAccount, ChatThread, PushNotification, Cart, Booking, CustomQuote, Review 
} from './types';
import { 
  subscribeVendors, 
  saveVendorToFirestore, 
  subscribeBookings, 
  createBookingInFirestore, 
  updateBookingStatusInFirestore, 
  subscribeChatThreads, 
  sendMessageToFirestore, 
  subscribeFavorites, 
  toggleFavoriteInFirestore, 
  subscribeUserAccount, 
  saveUserAccountToFirestore, 
  subscribeNotifications,
  getOrInitUserId
} from './firebase';

export default function App() {
  // Current user / frontend session ID
  const [userId, setUserId] = useState<string>(() => getOrInitUserId());

  // Core global data states
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [user, setUser] = useState<UserAccount>(INITIAL_USER);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHATS);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('partyplatter_auth') !== null;
  });
  const [userRole, setUserRole] = useState<'Consumer' | 'Vendor'>(() => {
    return (localStorage.getItem('partyplatter_role') as 'Consumer' | 'Vendor') || 'Consumer';
  });

  // User Frontend Switcher Modal & Cloud Storage Modal
  const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [customUserName, setCustomUserName] = useState('');

  // Layout & Navigation View states
  const [currentView, setCurrentView] = useState<string>('home'); // home, vendor_detail, account, bookings, messages, vendor_portal, cart
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  
  // Selection states
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [cameFromAI, setCameFromAI] = useState(false); // custom back routing

  // Cart & Active Reservations
  const [cart, setCart] = useState<Cart | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [activeBookingTracker, setActiveBookingTracker] = useState<Booking | null>(null);

  // Search & Filters on Home
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'caterer' | 'food_truck' | 'private_chef'>('caterer');
  const [activeCuisineChip, setActiveCuisineChip] = useState<string>('All');
  const [savedAddress, setSavedAddress] = useState(INITIAL_USER.savedAddresses[0]);

  // Push Notifications Active state
  const [activeNotification, setActiveNotification] = useState<PushNotification | null>(null);
  const [selectedChatThreadId, setSelectedChatThreadId] = useState<string | null>(null);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    // 1. Sync Vendors
    const unsubVendors = subscribeVendors((fetchedVendors) => {
      setVendors(fetchedVendors);
    });

    // 2. Sync Bookings
    const unsubBookings = subscribeBookings(userId, userRole, (fetchedBookings) => {
      setUserBookings(fetchedBookings);
    });

    // 3. Sync Chat Threads
    const unsubChats = subscribeChatThreads(userId, userRole, (fetchedThreads) => {
      setThreads(fetchedThreads);
    });

    // 4. Sync User Account
    const unsubUser = subscribeUserAccount(userId, (fetchedUser) => {
      setUser(fetchedUser);
    });

    // 5. Sync Notifications
    const unsubNotifs = subscribeNotifications(userId, (fetchedNotifs) => {
      setNotifications(fetchedNotifs);
    });

    return () => {
      unsubVendors();
      unsubBookings();
      unsubChats();
      unsubUser();
      unsubNotifs();
    };
  }, [userId, userRole]);

  // Sync saved address changes back to User State & Firestore
  useEffect(() => {
    if (savedAddress && !user.savedAddresses.includes(savedAddress)) {
      const updatedUser = {
        ...user,
        savedAddresses: [savedAddress, ...user.savedAddresses]
      };
      setUser(updatedUser);
      saveUserAccountToFirestore(userId, updatedUser);
    }
  }, [savedAddress]);

  // Switch to a new / different user frontend session
  const handleSwitchUserSession = (newUserId: string, newRole: 'Consumer' | 'Vendor', name?: string) => {
    localStorage.setItem('partyplatter_user_id', newUserId);
    localStorage.setItem('partyplatter_role', newRole);
    localStorage.setItem('partyplatter_auth', 'true');
    setUserId(newUserId);
    setUserRole(newRole);
    setIsLoggedIn(true);
    if (name) {
      const newAcc = { ...user, name, role: newRole };
      setUser(newAcc);
      saveUserAccountToFirestore(newUserId, newAcc);
    }
    setShowUserSwitcherModal(false);
  };

  // Handle addition of custom messaging quote to cart
  const handleAddCustomQuoteToCart = (vendorId: string, quote: CustomQuote) => {
    const matchedVendor = vendors.find(v => v.id === vendorId);
    if (!matchedVendor) return;

    const compiledCart: Cart = {
      vendorId: matchedVendor.id,
      vendorName: matchedVendor.name,
      vendorCategory: matchedVendor.category,
      selectedDishes: [], // custom menu has pre-assembled price
      durationHours: 3, // custom package default duration
      eventDate: '2026-08-15', // custom target event date
      eventTimeSlot: '6:00 PM',
      address: savedAddress,
      subtotal: quote.amount,
      durationFee: 0,
      serviceFee: Math.round((quote.amount * 0.1) * 100) / 100,
      tax: Math.round((quote.amount * 0.08) * 100) / 100,
      total: Math.round((quote.amount * 1.18) * 100) / 100,
      customQuoteApplied: {
        title: quote.title,
        amount: quote.amount,
        description: quote.items.join(', ')
      }
    };

    setCart(compiledCart);

    // Update quote isAddedToCart in thread state
    setThreads(prev => prev.map(t => {
      if (t.id === vendorId) {
        return {
          ...t,
          messages: t.messages.map(m => {
            if (m.customQuote && m.customQuote.title === quote.title) {
              return {
                ...m,
                customQuote: { ...m.customQuote, isAddedToCart: true }
              };
            }
            return m;
          })
        };
      }
      return t;
    }));

    // Alert user
    const quoteNotif: PushNotification = {
      id: `notif_quote_${Date.now()}`,
      title: '💼 Custom Quote Accepted!',
      body: `"${quote.title}" has been loaded into your checkout cart. Navigate to Checkout to secure your booking.`,
      timestamp: new Date().toISOString(),
      category: 'booking',
      isRead: false
    };
    setNotifications(prev => [quoteNotif, ...prev]);
    setActiveNotification(quoteNotif);
  };

  // Handle direct message thread generation
  const handleOpenDirectChat = (vendorId: string, initialMessage?: string) => {
    const matchedVendor = vendors.find(v => v.id === vendorId);
    if (!matchedVendor) return;

    // Check if thread already exists
    const threadExists = threads.find(t => t.id === vendorId);
    
    if (!threadExists) {
      const newThread: ChatThread = {
        id: vendorId,
        vendorId: vendorId,
        vendorName: matchedVendor.name,
        vendorImageUrl: matchedVendor.imageUrls[0],
        unreadCount: 0,
        lastMessageTime: new Date().toISOString(),
        messages: initialMessage ? [
          {
            id: `msg_init_${Date.now()}`,
            sender: 'user',
            text: initialMessage,
            timestamp: new Date().toISOString()
          },
          {
            id: `msg_init_reply_${Date.now()}`,
            sender: 'vendor',
            text: `Hi ${user.name}! CHE BELLO! Thank you for inquiring. Yes, I am available on that date and would love to prepare a delicious customized experience for your guests! How can I assist?`,
            timestamp: new Date().toISOString()
          }
        ] : []
      };
      setThreads(prev => [newThread, ...prev]);
    } else if (initialMessage) {
      // Thread exists, append message
      setThreads(prev => prev.map(t => {
        if (t.id === vendorId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: `msg_added_${Date.now()}`,
                sender: 'user',
                text: initialMessage,
                timestamp: new Date().toISOString()
              },
              {
                id: `msg_added_reply_${Date.now()}`,
                sender: 'vendor',
                text: `Awesome request! I can definitely make this adjustments for you. Let me coordinate details. 🥂`,
                timestamp: new Date().toISOString()
              }
            ],
            lastMessageTime: new Date().toISOString()
          };
        }
        return t;
      }));
    }

    setCurrentView('messages');
    setSelectedChatThreadId(vendorId);
    setDrawerOpen(false);
  };

  // Submit yelp-style star reviews back to global vendors
  const handleSubmitReview = (vendorId: string, rating: number, comment: string, tags: string[]) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      author: user.name,
      rating: rating,
      comment: comment,
      date: 'July 2026',
      tags: tags
    };

    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        const newCount = v.ratingCount + 1;
        const newRating = Math.round(((v.rating * v.ratingCount + rating) / newCount) * 10) / 10;
        return {
          ...v,
          rating: newRating,
          ratingCount: newCount
        };
      }
      return v;
    }));

    // Trigger Success Banner
    const feedbackNotif: PushNotification = {
      id: `notif_feed_${Date.now()}`,
      title: '🌟 Thank you for your review!',
      body: 'Your feedback was successfully broadcasted to the PartyPlatter community.',
      timestamp: new Date().toISOString(),
      category: 'review',
      isRead: false
    };
    setNotifications(prev => [feedbackNotif, ...prev]);
    setActiveNotification(feedbackNotif);
  };

  // Confirm Purchase, add to active reservations
  const handleConfirmPurchase = (booking: Booking) => {
    setUserBookings(prev => [booking, ...prev]);
    setCart(null);
    setActiveBookingTracker(booking);
    setCurrentView('cart'); // stays in checkout to track reservation live!

    // Check if vendor messaging thread exists to pin to top
    const threadExists = threads.find(t => t.id === booking.vendorId);
    if (!threadExists) {
      const newThread: ChatThread = {
        id: booking.vendorId,
        vendorId: booking.vendorId,
        vendorName: booking.vendorName,
        vendorImageUrl: booking.vendorImageUrl,
        unreadCount: 0,
        lastMessageTime: new Date().toISOString(),
        messages: [
          {
            id: `msg_auto_c_${Date.now()}`,
            sender: 'system',
            text: `System: Reservation Confirmed for ${booking.date} at ${booking.timeSlot}.`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      setThreads(prev => [newThread, ...prev]);
    } else {
      // pin thread to top by re-ordering
      setThreads(prev => {
        const filtered = prev.filter(t => t.id !== booking.vendorId);
        return [threadExists, ...filtered];
      });
    }

    // Trigger Real-time status transitions simulation
    // Confirmed -> En Route (after 15 seconds) -> Completed (after 30 seconds)
    setTimeout(() => {
      // Transition to En Route
      setActiveBookingTracker(prev => {
        if (!prev || prev.id !== booking.id) return prev;
        const updated: Booking = { ...prev, status: 'en_route' };
        
        // Push notification
        const routeNotif: PushNotification = {
          id: `notif_route_${Date.now()}`,
          title: '🚚 Vendor is En Route!',
          body: `${booking.vendorName} is traveling to your event address. Prepare your dining tables!`,
          timestamp: new Date().toISOString(),
          category: 'status',
          isRead: false
        };
        setNotifications(n => [routeNotif, ...n]);
        setActiveNotification(routeNotif);

        return updated;
      });
    }, 15000);

    setTimeout(() => {
      // Transition to Completed
      setActiveBookingTracker(prev => {
        if (!prev || prev.id !== booking.id) return prev;
        const updated: Booking = { ...prev, status: 'completed' };
        
        // Push notification
        const completeNotif: PushNotification = {
          id: `notif_comp_${Date.now()}`,
          title: '🍽️ Event Completed!',
          body: `Hope you enjoyed dining with ${booking.vendorName}! Share your experience by leaving a community review.`,
          timestamp: new Date().toISOString(),
          category: 'review',
          isRead: false
        };
        setNotifications(n => [completeNotif, ...n]);
        setActiveNotification(completeNotif);

        return updated;
      });
    }, 30000);
  };

  // Filters calculation for Homepage list
  const getFilteredVendors = () => {
    return vendors.filter(vendor => {
      // 0. Vendor Approval Status Check (Only approved vendors display publicly)
      const status = vendor.status || 'approved';
      if (status !== 'approved') return false;

      // 1. Category check
      if (vendor.category !== activeCategoryTab) return false;

      // 2. Cuisine chip check
      if (activeCuisineChip !== 'All') {
        const rawCuisine = activeCuisineChip.replace(/[^a-zA-Z]/g, '').trim(); // strip emoji
        if (activeCuisineChip === 'Flexible / Multi-Cuisine') {
          if (vendor.cuisine !== 'Flexible') return false;
        } else if (!vendor.cuisine.toLowerCase().includes(rawCuisine.toLowerCase()) && vendor.cuisine !== 'Flexible') {
          return false;
        }
      }

      // 3. Search text query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          vendor.name.toLowerCase().includes(q) ||
          vendor.cuisine.toLowerCase().includes(q) ||
          vendor.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  };

  const filteredVendors = getFilteredVendors();
  const totalUnreadMessages = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  // Quick navigation callbacks
  const handleHomeNavPress = () => {
    setCurrentView('home');
    setDrawerOpen(false);
    setSelectedVendor(null);
    setActiveBookingTracker(null);
  };

  if (!isLoggedIn) {
    return (
      <PhoneFrame onHomePress={() => {}}>
        <AuthScreen
          onAuthSuccess={(authenticatedUser, role) => {
            setUser(authenticatedUser);
            setUserRole(role);
            setIsLoggedIn(true);
            saveUserAccountToFirestore(userId, { ...authenticatedUser, role });
            if (role === 'Vendor') {
              setCurrentView('vendor_portal');
            } else {
              setCurrentView('home');
            }
          }}
          vendors={vendors}
          onPublishVendor={(newVendor) => {
            setVendors(prev => [newVendor, ...prev]);
            saveVendorToFirestore(newVendor);
            const pubNotif: PushNotification = {
              id: `notif_pub_${Date.now()}`,
              title: '🚀 Storefront Published!',
              body: `"${newVendor.name}" is now live on the PartyPlatter marketplace directory!`,
              timestamp: new Date().toISOString(),
              category: 'status',
              isRead: false
            };
            setNotifications(prev => [pubNotif, ...prev]);
            setActiveNotification(pubNotif);
          }}
        />
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame onHomePress={handleHomeNavPress}>
      {/* Hamburger sidebar Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        currentView={currentView}
        onNavigate={(viewId) => {
          if (viewId === 'switch_user') {
            setShowUserSwitcherModal(true);
            setDrawerOpen(false);
            return;
          }
          if (viewId === 'cloud_storage') {
            setShowCloudModal(true);
            setDrawerOpen(false);
            return;
          }
          setCurrentView(viewId);
          setActiveBookingTracker(null);
        }}
        unreadCount={totalUnreadMessages}
      />

      {/* Google Cloud File Upload & Storage Modal */}
      <CloudUploadModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        userRole={userRole}
      />

      {/* User Frontend Switcher Modal */}
      <AnimatePresence>
        {showUserSwitcherModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-[#800020]" />
                  <h3 className="text-sm font-extrabold text-slate-900">Google Cloud Backend & Users</h3>
                </div>
                <button
                  onClick={() => setShowUserSwitcherModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <p className="text-[11px] text-emerald-900 font-medium leading-tight">
                  <strong className="font-extrabold">Firestore Interconnected Live Backend:</strong> Active on project <code className="bg-emerald-100/80 px-1 rounded text-[10px]">mindful-fiber-24dh4</code>.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Session User
                </span>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-black text-slate-900 block">{user.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {userId} • {userRole}</span>
                  </div>
                  <span className="bg-[#800020]/10 text-[#800020] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Switch Independent Front-End User
                </span>
                
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleSwitchUserSession('user_kieran', 'Consumer', 'Kieran Nelson')}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-left transition-colors flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">Kieran Nelson</span>
                      <span className="text-[10px] text-slate-500">Consumer Account • Miami Event</span>
                    </div>
                    <Users className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleSwitchUserSession('user_chef_marco', 'Vendor', 'Chef Marco Rossi')}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-left transition-colors flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">Chef Marco Rossi</span>
                      <span className="text-[10px] text-slate-500">Private Chef Vendor Storefront</span>
                    </div>
                    <Users className="w-4 h-4 text-[#800020]" />
                  </button>

                  <button
                    onClick={() => handleSwitchUserSession('user_gourmet_garden', 'Vendor', 'Gourmet Garden Caterers')}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-left transition-colors flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">Gourmet Garden Caterers</span>
                      <span className="text-[10px] text-slate-500">Catering Business Vendor</span>
                    </div>
                    <Users className="w-4 h-4 text-[#E0A800]" />
                  </button>
                </div>
              </div>

              {/* Custom New User creation */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Create Independent Client Session
                </span>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter Custom User Name"
                    value={customUserName}
                    onChange={(e) => setCustomUserName(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 outline-none focus:bg-white"
                  />
                  <button
                    onClick={() => {
                      if (!customUserName.trim()) return;
                      const newId = 'user_custom_' + Date.now();
                      handleSwitchUserSession(newId, 'Consumer', customUserName.trim());
                      setCustomUserName('');
                    }}
                    className="bg-[#800020] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#660019]"
                  >
                    Launch
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main viewport based on active View */}
      <div className="flex-1 flex flex-col relative bg-[#F8F9FB] overflow-hidden h-full">
        
        {/* VIEW 1: HOME DASHBOARD */}
        {currentView === 'home' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Top Header Navigation Bar */}
            <div className="h-14 shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 z-20">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setDrawerOpen(true)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-800 active:scale-95 transition-all relative"
                >
                  <Menu className="w-5 h-5 text-slate-800" />
                  {totalUnreadMessages > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#800020] rounded-full ring-2 ring-white"></span>
                  )}
                </button>
                <Logo 
                  size="sm" 
                  onClick={() => { setCurrentView('home'); setActiveBookingTracker(null); }} 
                  showMarketBadge 
                />
              </div>

              {/* Top Right Checkout Cart Badge */}
              <button
                onClick={() => {
                  setCurrentView('cart');
                  setActiveBookingTracker(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-800 active:scale-95 transition-all relative"
              >
                <ShoppingBag className="w-5 h-5 text-slate-800" />
                {cart && (
                  <span className="absolute top-1 right-1 bg-[#800020] text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Scrolling Core Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
              
              {/* Deliver To Address Card */}
              <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#800020]/10 flex items-center justify-center shrink-0 text-[#800020]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Deliver To Event</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">{savedAddress}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAiOpen(true)}
                  className="text-[10px] font-bold text-[#800020] hover:bg-[#800020]/5 px-2.5 py-1 rounded-lg transition-colors shrink-0 ml-2"
                >
                  Change
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search barbecue trucks, sushi chefs, caterers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-10 pr-9 text-xs focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] text-slate-900 shadow-xs font-medium placeholder:text-slate-400 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Segmented Control */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-200/60 p-1 rounded-2xl">
                {[
                  { id: 'caterer', label: 'Caterers', emoji: '🍽️' },
                  { id: 'food_truck', label: 'Food Trucks', emoji: '🚚' },
                  { id: 'private_chef', label: 'Private Chefs', emoji: '👨‍🍳' }
                ].map((tab) => {
                  const isActive = activeCategoryTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveCategoryTab(tab.id as any);
                        setActiveCuisineChip('All');
                      }}
                      className={`py-2.5 px-1 rounded-xl text-xs transition-all flex flex-col items-center justify-center space-y-1 active:scale-95 duration-150 ${
                        isActive 
                          ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold' 
                          : 'text-slate-600 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      <span className="text-base">{tab.emoji}</span>
                      <span className="tracking-wide text-[10px]">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cuisine Filter Chips */}
              <div className="space-y-1.5">
                <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                  <button
                    onClick={() => setActiveCuisineChip('All')}
                    className={`text-xs py-1.5 px-3.5 rounded-full border shrink-0 transition-all font-semibold ${
                      activeCuisineChip === 'All'
                        ? 'bg-[#800020] border-[#800020] text-white shadow-xs font-bold'
                        : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Cuisines
                  </button>

                  {/* Category-specific chips */}
                  {activeCategoryTab === 'private_chef' && (
                    <button
                      onClick={() => setActiveCuisineChip('Flexible / Multi-Cuisine')}
                      className={`text-xs py-1.5 px-3.5 rounded-full border shrink-0 transition-all font-semibold ${
                        activeCuisineChip === 'Flexible / Multi-Cuisine'
                          ? 'bg-[#800020] border-[#800020] text-white shadow-xs font-bold'
                          : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      ✨ Multi-Cuisine / Flexible
                    </button>
                  )}

                  {[
                    { label: '🍕 Italian', match: 'Italian' },
                    { label: '🌮 Mexican', match: 'Mexican' },
                    { label: '🍣 Sushi', match: 'Sushi' },
                    { label: '🍔 American', match: 'American' },
                    { label: '🍱 Asian', match: 'Asian' },
                    { label: '🍰 Desserts', match: 'Desserts' },
                    { label: '🥗 Mediterranean', match: 'Mediterranean' },
                    { label: '🫓 Middle Eastern', match: 'Middle' },
                    { label: '🥖 French', match: 'French' },
                    { label: '🥘 Indian', match: 'Indian' },
                    { label: '🍲 Thai', match: 'Thai' },
                    { label: '🥩 BBQ', match: 'BBQ' },
                    { label: '🥗 Vegan/Vegetarian', match: 'Vegan' }
                  ].map((chip) => {
                    const isSelected = activeCuisineChip === chip.label;
                    return (
                      <button
                        key={chip.label}
                        onClick={() => setActiveCuisineChip(chip.label)}
                        className={`text-xs py-1.5 px-3.5 rounded-full border shrink-0 transition-all font-semibold ${
                          isSelected
                            ? 'bg-[#800020] border-[#800020] text-white shadow-xs font-bold'
                            : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Notice Banner */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 px-3.5 rounded-2xl text-[11px] text-amber-900 font-medium flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Rates and minimums vary based on event date, time slot, guest count & peak weekend demand.</span>
              </div>

              {/* Vendors List Results Grid */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                    Available Matched Vendors ({filteredVendors.length})
                  </span>
                </div>

                {filteredVendors.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/60 shadow-xs flex flex-col items-center">
                    <Info className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-extrabold text-slate-700">No matched vendors found</span>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">Try clearing your search query or choosing another cuisine category!</p>
                  </div>
                ) : (
                  filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setCameFromAI(false);
                        setCurrentView('vendor_detail');
                      }}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover-card-rise cursor-pointer group flex flex-col transition-all active:scale-[0.99]"
                    >
                      {/* Image Carousel Mock */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={vendor.imageUrls[0]}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-slate-900/85 backdrop-blur-md text-white font-extrabold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                            {vendor.cuisine}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-xs border border-white/40">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{vendor.rating}</span>
                          <span className="text-slate-400 text-[9px] font-medium">({vendor.ratingCount})</span>
                        </div>

                        {/* Price Badge */}
                        <div className="absolute bottom-3 left-3 bg-[#800020] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                          ${vendor.pricePerGuest} <span className="text-[9px] font-medium opacity-90">/ guest</span>
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#800020] transition-colors leading-snug">
                            {vendor.name}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                          {vendor.description}
                        </p>

                        {/* Bottom metrics */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-2.5 mt-2">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                            <span>Max {vendor.maxRadius} mi</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Min {vendor.minGuests} guests</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Book online
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FAB is deprecated - replaced by bottom nav bar prominent center tab */}
          </div>
        )}

        {/* VIEW 2: VENDOR DETAILED PAGE */}
        {currentView === 'vendor_detail' && selectedVendor && (
          <VendorPage
            vendor={selectedVendor}
            onBack={() => {
              if (cameFromAI) {
                setAiOpen(true);
              }
              setCurrentView('home');
            }}
            onAddToCart={(compiledCart) => {
              setCart(compiledCart);
              setCurrentView('cart');
              setActiveBookingTracker(null);

              // Notify success
              const addNotif: PushNotification = {
                id: `notif_add_${Date.now()}`,
                title: '🛒 Items added to booking!',
                body: `Your booking for ${selectedVendor.name} has been configured in the Checkout Cart.`,
                timestamp: new Date().toISOString(),
                category: 'booking',
                isRead: false
              };
              setNotifications(prev => [addNotif, ...prev]);
              setActiveNotification(addNotif);
            }}
            onOpenDirectChat={(vId, initialMsg) => {
              handleOpenDirectChat(vId, initialMsg);
            }}
            cart={cart}
          />
        )}

        {/* VIEW 3: MANAGE ACCOUNT VIEW */}
        {currentView === 'account' && (
          <AccountView
            user={user}
            setUser={setUser}
            userRole={userRole}
            onSignOut={() => {
              localStorage.removeItem('partyplatter_auth');
              localStorage.removeItem('partyplatter_role');
              setIsLoggedIn(false);
              setUserRole('Consumer');
              setUser(INITIAL_USER);
              setCurrentView('home');
            }}
            onSwitchRole={(newRole) => {
              localStorage.setItem('partyplatter_role', newRole);
              setUserRole(newRole);
              if (newRole === 'Vendor') {
                setCurrentView('vendor_portal');
              } else {
                setCurrentView('home');
              }
            }}
          />
        )}

        {/* VIEW 4: BOOKINGS & HISTORY LIST */}
        {currentView === 'bookings' && (
          <div className="absolute inset-0 bg-slate-100 z-30 flex flex-col overflow-y-auto no-scrollbar pb-20">
            {/* Header */}
            <div className="bg-[#7A0019] text-white p-4 pt-6 shrink-0 flex items-center justify-between shadow">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-[#FFC72C]" />
                <h3 className="text-base font-bold">Bookings & History</h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Tabbed view: Upcoming vs. Past */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1.5">Upcoming Reservations</span>
                
                {userBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 italic">No upcoming events scheduled. Explore private chefs to schedule one!</p>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setActiveBookingTracker(b);
                          setCurrentView('cart');
                        }}
                        className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 hover:bg-[#FFF8E7]/40 cursor-pointer transition-colors text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-900">{b.vendorName}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            b.status === 'completed' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : b.status === 'en_route' 
                                ? 'bg-amber-100 text-amber-700 animate-pulse' 
                                : 'bg-[#FFF8E7] text-[#7A0019]'
                          }`}>{b.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Event Date: {b.date} • {b.timeSlot}</p>
                        <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-1 border-t border-slate-200/40">
                          <span>{b.itemsCount} dishes ordered</span>
                          <span className="text-[#7A0019] font-bold">${b.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past events History */}
              <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1.5">Past Event History</span>
                
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span className="font-bold text-slate-700 block">Slider & Bite Burger Truck</span>
                    <p className="text-[10px] mt-0.5">June 14, 2026 • Grad Party</p>
                  </div>
                  <span className="font-extrabold">$480.00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: VENDOR MESSAGES HUB */}
        {currentView === 'messages' && (
          <ChatHub
            threads={threads}
            setThreads={setThreads}
            activeThreadId={selectedChatThreadId}
            onBackToInbox={() => setSelectedChatThreadId(null)}
            onAddCustomQuoteToCart={(vendorId, quote) => {
              handleAddCustomQuoteToCart(vendorId, quote);
              setCurrentView('cart');
            }}
            onOpenThread={(threadId) => setSelectedChatThreadId(threadId)}
          />
        )}

        {/* VIEW: FAVORITES SAVED VIEW */}
        {currentView === 'favorites' && (
          <FavoritesView
            vendors={vendors}
            onSelectVendor={(v) => {
              setSelectedVendor(v);
              setCurrentView('vendor_detail');
            }}
            onOpenDirectChat={handleOpenDirectChat}
            onExplore={() => setCurrentView('home')}
          />
        )}

        {/* VIEW: MASTER ADMIN CONTROL PANEL */}
        {currentView === 'admin_panel' && (
          <AdminDashboard
            vendors={vendors}
            setVendors={setVendors}
            onClose={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 6: VENDOR MANAGEMENT PORTAL (Business View) */}
        {currentView === 'vendor_portal' && (
          <VendorPortal
            vendors={vendors}
            setVendors={setVendors}
            onClose={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 7: CHECKOUT CART VIEW */}
        {currentView === 'cart' && (
          <CartCheckout
            cart={cart}
            onClearCart={() => setCart(null)}
            user={user}
            onConfirmPurchase={handleConfirmPurchase}
            onSubmitReview={handleSubmitReview}
            activeBookingTracker={activeBookingTracker}
            onOpenDirectChat={(vId, initialMsg) => {
              handleOpenDirectChat(vId, initialMsg);
            }}
            onUpdateCartDishes={(updatedDishes) => {
              if (cart) {
                const dishesSubtotal = updatedDishes.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
                const newSubtotal = cart.customQuoteApplied ? cart.subtotal : dishesSubtotal;
                const newServiceFee = Math.round((newSubtotal * 0.1) * 100) / 100;
                const newTax = Math.round((newSubtotal * 0.08) * 100) / 100;
                const newTotal = Math.round((newSubtotal + cart.durationFee + newServiceFee + newTax) * 100) / 100;
                
                setCart({
                  ...cart,
                  selectedDishes: updatedDishes,
                  subtotal: newSubtotal,
                  serviceFee: newServiceFee,
                  tax: newTax,
                  total: newTotal
                });
              }
            }}
          />
        )}

        {/* Persistent Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shrink-0 z-40 flex items-center justify-around px-2 text-slate-400 shadow-lg">
          {[
            { id: 'home', label: 'Home', icon: <Search className="w-5 h-5" /> },
            { id: 'messages', label: 'Chat', icon: <MessageSquare className="w-5 h-5" />, badge: totalUnreadMessages },
            { id: 'ai_planner', label: 'AI Planner', icon: (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#800020] via-[#9B112E] to-[#800020] flex items-center justify-center shadow-lg border-2 border-[#D4AF37] -mt-5 relative transition-all duration-200 hover:scale-105 active:scale-95 group">
                <Sparkles className="w-5.5 h-5.5 text-[#D4AF37] fill-[#D4AF37] group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-slate-900 font-extrabold text-[7px] px-1.5 py-0.5 rounded-full border border-white uppercase shadow-xs">
                  AI
                </span>
              </div>
            ) },
            { id: 'cart', label: 'Cart', icon: <ShoppingBag className="w-5 h-5" />, badge: cart ? 1 : undefined },
            { id: 'account', label: 'Profile', icon: <User className="w-5 h-5" /> }
          ].map((tab) => {
            const isActive = tab.id === 'ai_planner' ? aiOpen : currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'ai_planner') {
                    setAiOpen(true);
                  } else {
                    setCurrentView(tab.id);
                    setSelectedChatThreadId(null);
                    setActiveBookingTracker(null);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-150 active:scale-95 ${
                  isActive ? 'text-[#800020] font-bold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#800020] text-white font-extrabold text-[8px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold tracking-tight ${tab.id === 'ai_planner' ? 'mt-1 text-[#800020]' : 'mt-1'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Embedded PlatterAI Dialog overlay sheet */}
      <PlatterAI
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        vendors={vendors}
        user={user}
        onVendorSelect={(vendor) => {
          setSelectedVendor(vendor);
          setCameFromAI(true);
          setCurrentView('vendor_detail');
          setAiOpen(false);
        }}
        savedAddress={savedAddress}
        setSavedAddress={setSavedAddress}
      />
    </PhoneFrame>
  );
}
export function User({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}
