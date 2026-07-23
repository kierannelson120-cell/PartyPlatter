import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Check, ShieldCheck, CreditCard, Star, 
  Trash2, FileText, Gift, Sparkles, MessageSquare, ChevronRight, 
  CheckSquare, Minus, Plus, AlertCircle
} from 'lucide-react';
import { Cart, UserAccount, Booking, CartDish } from '../types';
import VendorMap from './VendorMap';

interface CartCheckoutProps {
  cart: Cart | null;
  onClearCart: () => void;
  user: UserAccount;
  onConfirmPurchase: (booking: Booking) => void;
  onSubmitReview: (vendorId: string, rating: number, comment: string, tags: string[]) => void;
  activeBookingTracker: Booking | null;
  onOpenDirectChat: (vendorId: string, initialMessage?: string) => void;
  onUpdateCartDishes?: (dishes: CartDish[]) => void;
}

export default function CartCheckout({
  cart,
  onClearCart,
  user,
  onConfirmPurchase,
  onSubmitReview,
  activeBookingTracker,
  onOpenDirectChat,
  onUpdateCartDishes
}: CartCheckoutProps) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(user.savedPayments[0]?.id || 'apple_pay');
  const [paymentType, setPaymentType] = useState<'saved' | 'new_card' | 'apple_pay'>('apple_pay');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [newCardName, setNewCardName] = useState('');

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Confirmatory Celebratory overlay
  const [showCelebration, setShowCelebration] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Star Review local form
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Handle local quantity adjustment
  const handleUpdateItemQuantity = (itemId: string, increment: number) => {
    if (!cart || !onUpdateCartDishes) return;
    const updatedDishes = cart.selectedDishes.map(dish => {
      if (dish.item.id === itemId) {
        const nextQty = Math.max(1, dish.quantity + increment);
        return { ...dish, quantity: nextQty };
      }
      return dish;
    });
    onUpdateCartDishes(updatedDishes);
  };

  // Handle local special instruction edits
  const handleUpdateItemInstructions = (itemId: string, text: string) => {
    if (!cart || !onUpdateCartDishes) return;
    const updatedDishes = cart.selectedDishes.map(dish => {
      if (dish.item.id === itemId) {
        return { ...dish, instructions: text };
      }
      return dish;
    });
    onUpdateCartDishes(updatedDishes);
  };

  // Handle item deletion
  const handleRemoveItem = (itemId: string) => {
    if (!cart || !onUpdateCartDishes) return;
    const updatedDishes = cart.selectedDishes.filter(dish => dish.item.id !== itemId);
    onUpdateCartDishes(updatedDishes);
  };

  if (activeBookingTracker) {
    // If there is an active tracking, display status and review form!
    return (
      <div className="absolute inset-0 bg-slate-50 z-30 flex flex-col overflow-y-auto no-scrollbar pb-20">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 shrink-0 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-base font-extrabold text-white">Live Booking Tracker</h3>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="p-4 space-y-4">
          
          {/* Item 6: Live Google Maps / Vector Logistics Integration */}
          {activeBookingTracker.status === 'en_route' && (
            <VendorMap 
              vendorLocation="Catering Kitchen Headquarters" 
              vendorName={activeBookingTracker.vendorName} 
              deliveryAddress={activeBookingTracker.details.address} 
              maxRadius={25} 
            />
          )}

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <img src={activeBookingTracker.vendorImageUrl} className="w-full h-full object-cover animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{activeBookingTracker.vendorName}</h4>
                <p className="text-[10px] text-slate-400 font-medium">Date: {activeBookingTracker.date} • {activeBookingTracker.timeSlot}</p>
              </div>
            </div>

            {/* Tracking Progress Steps */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Event Tracking Status</span>
              
              <div className="relative pl-6 space-y-5">
                {/* Vertical tracking line */}
                <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-slate-200"></div>

                {/* Step 1: Confirmed */}
                <div className="relative">
                  <div className={`absolute left-[-23px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center ${
                    activeBookingTracker.status === 'confirmed' || activeBookingTracker.status === 'en_route' || activeBookingTracker.status === 'completed'
                      ? 'bg-[#800020]' : 'bg-slate-300'
                  }`}></div>
                  <span className="block text-xs font-bold text-slate-800">Booking Confirmed</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Vendor has locked in your slots & menu details</span>
                </div>

                {/* Step 2: En route */}
                <div className="relative">
                  <div className={`absolute left-[-23px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center ${
                    activeBookingTracker.status === 'en_route' || activeBookingTracker.status === 'completed'
                      ? 'bg-[#800020] animate-pulse' : 'bg-slate-300'
                  }`}></div>
                  <span className="block text-xs font-bold text-slate-800">Vendor En Route</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Chef or Food Truck is moving towards your event address</span>
                </div>

                {/* Step 3: Event Completed */}
                <div className="relative">
                  <div className={`absolute left-[-23px] w-4.5 h-4.5 rounded-full border-4 border-white flex items-center justify-center ${
                    activeBookingTracker.status === 'completed'
                      ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}></div>
                  <span className="block text-xs font-bold text-slate-800">Event Dining Completed</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">A culinary success! Bon appétit!</span>
                </div>
              </div>
            </div>

            {/* Message shortcut */}
            <button
              onClick={() => onOpenDirectChat(activeBookingTracker.vendorId, `Hi! Just wanted to coordinate logistics for our event on ${activeBookingTracker.date}.`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-xs active:scale-98"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span>Direct Chat with Vendor</span>
            </button>
          </div>

          {/* Yelp-style review form - Show immediately when completed */}
          {activeBookingTracker.status === 'completed' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-sm space-y-3.5">
              <div className="flex items-center space-x-2 text-[#7A0019] font-extrabold text-xs">
                <Star className="w-4 h-4 fill-[#FFF8E7]" />
                <span>Submit Event Review</span>
              </div>
              
              {reviewSubmitted ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-800">Review Submitted Successfully!</h5>
                  <p className="text-[10px] text-slate-400">Thank you for sharing your experience with the community.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    How was your culinary dining experience? Submit a 1-5 star review below!
                  </p>

                  {/* Stars input */}
                  <div className="flex justify-center space-x-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-8 h-8 ${
                          star <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`} />
                      </button>
                    ))}
                  </div>

                  {/* Review comment input */}
                  <textarea
                    rows={3}
                    placeholder="Describe the dishes, service, punctuality, and presentation..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:outline-none resize-none focus:bg-white"
                  />

                  <button
                    onClick={() => {
                      onSubmitReview(activeBookingTracker.vendorId, ratingInput, reviewComment, ['Delicious', 'On-Time']);
                      setReviewSubmitted(true);
                    }}
                    className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md"
                  >
                    Submit {ratingInput}-Star Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Calculate pricing breakdown
  if (!cart) {
    return (
      <div className="absolute inset-0 bg-[#F8F9FB] z-30 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-[#FFF8E7] rounded-full flex items-center justify-center text-[#7A0019] mb-4 shadow-inner">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Your Booking Cart is Empty</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
          Discover private chefs and food trucks on the home screen to book your custom event dining!
        </p>
      </div>
    );
  }

  // Pricing calculations
  const isWeekend = () => {
    if (!cart.eventDate) return false;
    const d = new Date(cart.eventDate);
    const day = d.getDay();
    return day === 0 || day === 5 || day === 6;
  };

  const promoDiscount = discountApplied ? Math.round((cart.subtotal * 0.15) * 100) / 100 : 0; // 15% discount
  const serviceFee = cart.serviceFee;
  const durationFee = cart.durationFee;
  const tax = cart.tax;
  const subtotalWithPromo = cart.subtotal - promoDiscount;
  const finalTotal = Math.round((subtotalWithPromo + durationFee + serviceFee + tax) * 100) / 100;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'PARTY15') {
      setDiscountApplied(true);
    } else {
      alert('Invalid Promo Code! Try "PARTY15" for 15% off.');
    }
  };

  const handlePurchase = () => {
    setIsProcessing(true);
    setProcessingStep('Encrypting payment token with Stripe SSL 256-bit...');

    setTimeout(() => {
      setProcessingStep('Verifying bank authorization & card security checks...');
    }, 1000);

    setTimeout(() => {
      setProcessingStep('Creating reservation intent & locking calendar slot...');
    }, 2000);

    setTimeout(() => {
      setIsProcessing(false);
      // Generate a new confirmed Booking model
      const newBooking: Booking = {
        id: `TX_STRIPE_${Math.floor(100000 + Math.random() * 900000)}`,
        vendorId: cart.vendorId,
        vendorName: cart.vendorName,
        vendorCategory: cart.vendorCategory,
        vendorImageUrl: cart.vendorCategory === 'caterer' 
          ? 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100&auto=format&fit=crop&q=80'
          : cart.vendorCategory === 'food_truck'
            ? 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=100&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&auto=format&fit=crop&q=80',
        date: cart.eventDate,
        timeSlot: cart.eventTimeSlot,
        status: 'confirmed',
        itemsCount: cart.selectedDishes.length,
        totalAmount: finalTotal,
        details: {
          address: cart.address,
          dishes: cart.selectedDishes,
          durationHours: cart.durationHours,
          durationFee: cart.durationFee,
          customQuoteApplied: cart.customQuoteApplied
        }
      };

      setConfirmedBooking(newBooking);
      setShowCelebration(true);
    }, 2800);
  };

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-30 flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white text-slate-800 p-4 shrink-0 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-[#7A0019]" />
          <h3 className="text-base font-bold text-slate-900">Booking Checkout</h3>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs font-bold text-red-500 hover:text-red-650"
        >
          Clear
        </button>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Itemized service details */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked Dining Service</span>
            <span className="text-[10px] bg-[#FFF8E7] text-[#7A0019] font-extrabold px-2 py-0.5 rounded uppercase">
              {cart.vendorCategory}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between font-bold text-slate-900 text-sm">
              <span>{cart.vendorName}</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5">
              <p>📍 Address: {cart.address}</p>
              <p>📅 Event Date: {cart.eventDate} ({isWeekend() ? 'Peak Weekend' : 'Standard Rate'})</p>
              <p>🕒 Time Slot: {cart.eventTimeSlot} • Duration: {cart.durationHours} Hours</p>
            </div>
          </div>

          {/* Custom Quote Notice if applied */}
          {cart.customQuoteApplied && (
            <div className="bg-[#FFF8E7] p-3 rounded-xl border border-[#FFC72C]/30 text-xs">
              <div className="flex items-center gap-1 text-[#7A0019] font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-[#FFF8E7]" />
                <span>Custom Direct Invoice Applied</span>
              </div>
              <p className="text-[10px] text-[#5E0012] mt-1">“{cart.customQuoteApplied.description}”</p>
            </div>
          )}

          {/* Item 4: Interactive Itemized list with +/- modifiers inside Checkout */}
          {cart.selectedDishes.length > 0 && (
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Dish Add-ons List</span>
              <div className="divide-y divide-slate-100 space-y-3">
                {cart.selectedDishes.map((dish) => (
                  <div key={dish.item.id} className="pt-2.5 space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <div className="min-w-0 pr-2">
                        <span className="text-slate-950 font-extrabold truncate block">{dish.item.name}</span>
                        <span className="text-[10px] text-slate-400">${dish.item.price} each</span>
                      </div>
                      
                      {/* Modifiers block */}
                      <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => handleUpdateItemQuantity(dish.item.id, -1)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-4 text-center text-slate-800">{dish.quantity}</span>
                        <button
                          onClick={() => handleUpdateItemQuantity(dish.item.id, 1)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleRemoveItem(dish.item.id)}
                          className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Inline special instruction input */}
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-400 shrink-0">NOTES:</span>
                      <input
                        type="text"
                        value={dish.instructions}
                        onChange={(e) => handleUpdateItemInstructions(dish.item.id, e.target.value)}
                        placeholder="e.g. sauce on side, allergy notes..."
                        className="flex-1 bg-transparent text-[10px] text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Promo code */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Promo Codes</span>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white uppercase font-black"
            />
            <button
              onClick={handleApplyPromo}
              className="bg-[#7A0019] text-white text-xs font-bold py-2 px-4 rounded-xl shadow active:scale-95 transition-transform"
            >
              Apply
            </button>
          </div>
          {discountApplied && (
            <span className="text-[10px] text-emerald-600 font-extrabold block">
              ✓ Promo code applied! 15% discount subtracted from subtotal.
            </span>
          )}
        </div>

        {/* Payment selector */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Secure Payment</span>
          
          <div className="space-y-2">
            {user.savedPayments.map((p) => {
              const isSelected = selectedPaymentId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPaymentId(p.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    isSelected ? 'bg-[#FFF8E7] border-[#7A0019]' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-xs">
                    <CreditCard className={`w-4 h-4 ${isSelected ? 'text-[#7A0019]' : 'text-slate-400'}`} />
                    <div>
                      <span className="font-extrabold text-slate-900">{p.brand} ending in {p.last4}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Expires {p.expiry}</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#7A0019]' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-[#7A0019] rounded-full"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order pricing breakdown summary */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1.5 mb-1.5">Pricing breakdown</span>
          
          <div className="flex justify-between text-slate-600">
            <span>Dining Base Rate Subtotal:</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>

          {discountApplied && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Promo PARTY15 Discount (15%):</span>
              <span>-${promoDiscount.toFixed(2)}</span>
            </div>
          )}

          {durationFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Extended service hours fee:</span>
              <span>+${durationFee.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>Marketplace Platform Fee (10%):</span>
            <span>+${serviceFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>State Sales Tax (8%):</span>
            <span>+${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-slate-950 font-black text-sm pt-2 border-t border-slate-100">
            <span>Total Cost Booking:</span>
            <span className="text-[#7A0019]">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Secure checkout footer CTA */}
        <div className="bg-slate-100 p-3 rounded-2xl flex items-center space-x-2 text-[10px] text-slate-400 font-bold border border-slate-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Payment encrypted by Stripe API protocols. Cancellations up to 48 hours prior are 100% refundable.</span>
        </div>

        <button
          onClick={handlePurchase}
          className="w-full bg-[#7A0019] hover:bg-[#5E0012] active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Confirm Booking Reservation • ${finalTotal.toFixed(2)}</span>
        </button>

      </div>

      {/* Celebratory Post-Purchase Overlay */}
      <AnimatePresence>
        {showCelebration && confirmedBooking && (
          <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-6 text-center text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4 max-w-sm"
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block font-mono">RESERVATION SECURED</span>
                <h3 className="text-xl font-bold tracking-tight mt-1">Booking Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Chef {confirmedBooking.vendorName} is now locked in for your event on <strong>{confirmedBooking.date}</strong>! They will arrive 60 mins early for setup.
                </p>
              </div>

              {/* Quick Summary card */}
              <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80 text-left text-xs space-y-1.5 font-sans">
                <div className="flex justify-between font-bold">
                  <span>Merchant:</span>
                  <span className="text-[#FFC72C]">{confirmedBooking.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{cart.subtotal ? 'Configured Group' : 'Full Team'}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Receipt ID:</span>
                  <span className="font-mono uppercase">{confirmedBooking.id}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    onConfirmPurchase(confirmedBooking);
                  }}
                  className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white font-bold py-3 rounded-xl text-xs shadow"
                >
                  Track Live Logistics Map
                </button>
                <button
                  onClick={() => {
                    setShowCelebration(false);
                    onClearCart();
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
                >
                  Back to Marketplace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
