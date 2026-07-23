export type VendorCategory = 'caterer' | 'food_truck' | 'private_chef';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  tags: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Drinks';
  imageUrl: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  cuisine: string; // e.g. "Italian", "Mexican", "Sushi", "American", "Asian", "Desserts", "Flexible"
  pricePerGuest: number;
  minGuests: number;
  rating: number;
  ratingCount: number;
  description: string;
  imageUrls: string[];
  menuItems: MenuItem[];
  maxRadius: number; // in miles
  pricingNotes: string;
  customMenuSupported: boolean;
  weekendRatePercentage: number; // e.g. 15 for 15% increase
  blockedDates: string[]; // dates blocked out "YYYY-MM-DD"
  workingHours: { start: string; end: string }; // e.g. "10:00" to "22:00"
  locationName: string;
  status?: 'approved' | 'pending_review' | 'rejected';
}

export interface CartDish {
  item: MenuItem;
  quantity: number;
  instructions: string;
}

export interface Cart {
  vendorId: string;
  vendorName: string;
  vendorCategory: VendorCategory;
  selectedDishes: CartDish[];
  durationHours: number;
  eventDate: string;
  eventTimeSlot: string; // e.g. "18:00"
  address: string;
  subtotal: number;
  durationFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  customQuoteApplied?: {
    title: string;
    amount: number;
    description: string;
  };
}

export type BookingStatus = 'confirmed' | 'en_route' | 'completed';

export interface Booking {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: VendorCategory;
  vendorImageUrl: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  itemsCount: number;
  totalAmount: number;
  details: {
    address: string;
    dishes: CartDish[];
    durationHours: number;
    durationFee: number;
    customQuoteApplied?: {
      title: string;
      amount: number;
      description: string;
    };
  };
}

export interface CustomQuote {
  title: string;
  amount: number;
  items: string[];
  isAddedToCart?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'vendor' | 'system';
  text: string;
  timestamp: string; // ISO string
  customQuote?: CustomQuote;
}

export interface ChatThread {
  id: string; // matches vendorId
  vendorId: string;
  vendorName: string;
  vendorImageUrl: string;
  messages: ChatMessage[];
  lastMessageTime: string;
  unreadCount: number;
}

export interface UserAccount {
  name: string;
  phone: string;
  email: string;
  role?: 'Consumer' | 'Vendor' | 'MasterAdmin';
  savedAddresses: string[];
  savedPayments: Array<{
    id: string;
    brand: 'Visa' | 'MasterCard' | 'ApplePay' | 'Amex';
    last4: string;
    expiry: string;
    isDefault: boolean;
  }>;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'booking' | 'message' | 'status' | 'review';
  isRead: boolean;
}

export interface CloudFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'Catering Menu' | 'Permit & Insurance' | 'Venue Layout' | 'Dish Image' | 'Event Specification' | 'General Document';
  dataUrl?: string;
  cloudUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByRole?: string;
  vendorId?: string;
  notes?: string;
}

