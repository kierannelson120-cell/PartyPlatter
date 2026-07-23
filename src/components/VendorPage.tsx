import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Star, MapPin, Calendar as CalendarIcon, Clock, 
  Minus, Plus, ShoppingBag, MessageSquare, Info, Sparkles, Check, 
  ChevronRight, ChevronLeft, CalendarRange, Users, Heart, X, ShieldCheck
} from 'lucide-react';
import { Vendor, MenuItem, Cart, CartDish, ChatThread } from '../types';

interface VendorPageProps {
  vendor: Vendor;
  onBack: () => void;
  onAddToCart: (cart: Cart) => void;
  onOpenDirectChat: (vendorId: string, initialMessage?: string) => void;
  cart: Cart | null;
}

export default function VendorPage({ vendor, onBack, onAddToCart, onOpenDirectChat, cart }: VendorPageProps) {
  // Booking selections
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [durationHours, setDurationHours] = useState<number>(2); // Default 2 hours

  // Custom private chef booking mode state
  const [bookingMode, setBookingMode] = useState<'prix_fixe' | 'carte' | 'custom'>(
    vendor.category === 'private_chef' ? 'carte' : 'carte'
  );

  // Favorites heart toggle
  const [isFavorited, setIsFavorited] = useState(false);

  // Sync favorites state with local storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('partyplatter_favs');
    if (savedFavs) {
      try {
        const parsed = JSON.parse(savedFavs) as string[];
        setIsFavorited(parsed.includes(vendor.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [vendor.id]);

  const toggleFavorite = () => {
    const savedFavs = localStorage.getItem('partyplatter_favs');
    let parsed: string[] = [];
    if (savedFavs) {
      try {
        parsed = JSON.parse(savedFavs) as string[];
      } catch (e) {
        console.error(e);
      }
    }
    if (parsed.includes(vendor.id)) {
      parsed = parsed.filter(id => id !== vendor.id);
      setIsFavorited(false);
    } else {
      parsed.push(vendor.id);
      setIsFavorited(true);
    }
    localStorage.setItem('partyplatter_favs', JSON.stringify(parsed));
  };

  // Calendar Horizontal Horizon Navigation
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

  const getCalendarDays = () => {
    const year = 2026;
    const month = 6 + currentMonthOffset; // 6 is July (starting month of 2026)
    const baseDate = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthName = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const list = [];
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[d.getDay()];
      const fullStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      list.push({ day: dayName, num: String(i), full: fullStr });
    }
    return { monthName, days: list };
  };

  const { monthName, days: activeMonthDays } = getCalendarDays();

  // Cart dishes local state
  const [selectedDishes, setSelectedDishes] = useState<CartDish[]>([]);

  // Selected item for Detailed Modal
  const [selectedItemModal, setSelectedItemModal] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [modalInstructions, setModalInstructions] = useState<string>('');

  // Active Menu Category Filter
  const [activeCategory, setActiveCategory] = useState<'Appetizers' | 'Mains' | 'Desserts' | 'Drinks'>('Appetizers');

  // Load existing cart items if it matches this vendor
  useEffect(() => {
    if (cart && cart.vendorId === vendor.id) {
      setSelectedDishes(cart.selectedDishes);
      setSelectedDate(cart.eventDate);
      setSelectedTime(cart.eventTimeSlot);
      setDurationHours(cart.durationHours);
    }
  }, [cart, vendor]);

  // Pricing calculations
  const standardDuration = 2;
  const extraHourRate = 100;
  const durationFee = durationHours > standardDuration ? (durationHours - standardDuration) * extraHourRate : 0;
  
  const dishesSubtotal = selectedDishes.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  
  // Per guest base minimum or guest amount selection
  const [guestCount, setGuestCount] = useState<number>(vendor.minGuests);

  // Chef Custom Form state
  const [customBudget, setCustomBudget] = useState('100');
  const [customDiet, setCustomDiet] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Strict food-based rate per guest (no automated tier discounts)
  const activePerGuestRate = bookingMode === 'prix_fixe' 
    ? 75 
    : (bookingMode === 'custom' ? (Number(customBudget) || 100) : vendor.pricePerGuest);

  const guestBaseFee = guestCount * activePerGuestRate;

  // For Prix-Fixe and Custom, base food is guestBaseFee. For À La Carte, base food is exact cost of selected dish portions
  const totalPortionsSelected = selectedDishes.reduce((sum, item) => sum + item.quantity, 0);

  const baseFoodSubtotal = bookingMode === 'prix_fixe' 
    ? guestBaseFee 
    : (bookingMode === 'custom' ? guestBaseFee : (selectedDishes.length > 0 ? dishesSubtotal : 0));

  // Check if weekend rate applies (Friday, Saturday, Sunday)
  const isWeekendSelected = () => {
    if (!selectedDate) return false;
    const d = new Date(selectedDate);
    const day = d.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    return day === 0 || day === 5 || day === 6;
  };

  const weekendMultiplier = isWeekendSelected() ? (1 + vendor.weekendRatePercentage / 100) : 1;
  const subtotalRaw = baseFoodSubtotal * weekendMultiplier;
  const finalSubtotal = Math.round(subtotalRaw * 100) / 100;

  const serviceFee = Math.round((finalSubtotal * 0.1) * 100) / 100; // 10%
  const tax = Math.round((finalSubtotal * 0.08) * 100) / 100; // 8%
  const finalTotal = Math.round((finalSubtotal + durationFee + serviceFee + tax) * 100) / 100;

  // Add Item Modal handler
  const handleOpenItemModal = (item: MenuItem) => {
    const existing = selectedDishes.find(d => d.item.id === item.id);
    setSelectedItemModal(item);
    setModalQuantity(existing ? existing.quantity : 1);
    setModalInstructions(existing ? existing.instructions : '');
  };

  const handleSaveModalItem = (forcedQuantity?: number) => {
    if (!selectedItemModal) return;

    const finalQty = forcedQuantity !== undefined ? forcedQuantity : (modalQuantity === 0 ? 1 : modalQuantity);
    const newList = [...selectedDishes];
    const index = newList.findIndex(d => d.item.id === selectedItemModal.id);

    if (finalQty <= 0) {
      if (index > -1) newList.splice(index, 1);
    } else {
      if (index > -1) {
        newList[index] = {
          item: selectedItemModal,
          quantity: finalQty,
          instructions: modalInstructions
        };
      } else {
        newList.push({
          item: selectedItemModal,
          quantity: finalQty,
          instructions: modalInstructions
        });
      }
    }

    setSelectedDishes(newList);
    setSelectedItemModal(null);
  };

  // Adjust list counts directly
  const handleUpdateQuantity = (itemId: string, increment: number) => {
    const newList = [...selectedDishes];
    const index = newList.findIndex(d => d.item.id === itemId);
    if (index > -1) {
      const updatedQty = newList[index].quantity + increment;
      if (updatedQty <= 0) {
        newList.splice(index, 1);
      } else {
        newList[index].quantity = updatedQty;
      }
      setSelectedDishes(newList);
    }
  };

  const handleAddToCart = () => {
    if (!selectedDate) {
      alert("Please select an event date before booking!");
      const dateEl = document.getElementById('calendar-selection-section');
      if (dateEl) {
        dateEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (!selectedTime) {
      alert("Please select an event time slot before booking!");
      const dateEl = document.getElementById('calendar-selection-section');
      if (dateEl) {
        dateEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const compiledCart: Cart = {
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorCategory: vendor.category,
      selectedDishes: bookingMode === 'prix_fixe' ? [] : selectedDishes,
      durationHours: durationHours,
      eventDate: selectedDate,
      eventTimeSlot: selectedTime,
      address: '242 Ocean Drive, Miami, FL',
      subtotal: finalSubtotal,
      durationFee: durationFee,
      serviceFee: serviceFee,
      tax: tax,
      total: finalTotal
    };

    if (bookingMode === 'prix_fixe') {
      compiledCart.customQuoteApplied = {
        title: '3-Course Prix-Fixe Dining Package',
        amount: guestBaseFee,
        description: 'Chef\'s signature handpicked 3-course multi-tiered guest menu selection.'
      };
    }

    onAddToCart(compiledCart);
  };

  const handleCustomRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select your desired event date first!");
      return;
    }
    const reqText = `Hi Chef ${vendor.name}! I would like to lock in a custom chef package.
    - Event Date: ${selectedDate}
    - Guests: ${guestCount}
    - Per-Guest Budget: $${customBudget}/person
    - Dietary restrictions: ${customDiet || 'None'}
    - Details: ${customNotes || 'Looking forward to an amazing tableside dining experience!'}`;
    
    onOpenDirectChat(vendor.id, reqText);
  };

  const mockTimes = ['11:00 AM', '1:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-30 flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Absolute Header Overlay */}
      <div className="relative h-60 bg-slate-900">
        <img
          src={vendor.imageUrls[0]}
          alt={vendor.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Floating Controls */}
        <div className="absolute top-5 inset-x-4 flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="w-9 h-9 bg-slate-900/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-white hover:bg-slate-900 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFavorite}
            className="w-9 h-9 bg-slate-900/80 backdrop-blur-md rounded-full shadow-md flex items-center justify-center text-rose-500 hover:bg-slate-900 active:scale-95 transition-all"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner inside Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center space-x-2">
            <span className="bg-[#800020] text-white font-extrabold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-white/20">
              {vendor.category === 'caterer' ? 'Catering Service' : vendor.category === 'food_truck' ? 'Food Truck' : 'Private Chef'}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md font-extrabold text-[9px] px-2.5 py-1 rounded-full text-slate-200 uppercase tracking-wider">
              {vendor.cuisine} cuisine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-2 text-white">{vendor.name}</h2>
          <p className="text-xs text-slate-300 flex items-center space-x-1.5 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Serves {vendor.maxRadius} miles from {vendor.locationName}</span>
          </p>
        </div>
      </div>

      {/* Pricing Notice Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 flex items-start gap-2.5 px-4 text-amber-900">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[11px] leading-relaxed text-amber-950 font-medium">
          {vendor.pricingNotes}
        </p>
      </div>

      {/* Mode Select Tabs for Private Chefs */}
      {vendor.category === 'private_chef' && (
        <div className="p-4 pb-0">
          <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-2xl">
            <button
              onClick={() => setBookingMode('carte')}
              className={`py-2 text-[10px] font-extrabold rounded-xl transition-all ${
                bookingMode === 'carte' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              À LA CARTE
            </button>
            <button
              onClick={() => setBookingMode('prix_fixe')}
              className={`py-2 text-[10px] font-extrabold rounded-xl transition-all ${
                bookingMode === 'prix_fixe' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PRIX-FIXE MENU
            </button>
            <button
              onClick={() => setBookingMode('custom')}
              className={`py-2 text-[10px] font-extrabold rounded-xl transition-all ${
                bookingMode === 'custom' ? 'bg-[#800020] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CUSTOM REQUEST
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="p-4 space-y-4">
        
        {/* Rating & Prestigious Chef Bio Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="text-sm font-black text-slate-900">{vendor.rating}</span>
              <span className="text-xs text-slate-400">({vendor.ratingCount} culinary reviews)</span>
            </div>
            <div className="text-xs font-black text-[#7A0019] bg-[#FFF8E7] px-2.5 py-1 rounded-md border border-[#FFC72C]/40">
              ${vendor.pricePerGuest} / Guest
            </div>
          </div>

          {vendor.category === 'private_chef' ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <span className="bg-[#7A0019] text-[#FFC72C] text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md">
                  Bespoke Chef Portfolio
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold font-mono">EST. 2018</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#7A0019] uppercase tracking-wider">Culinary Background & Biography</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {vendor.description || "Classically trained at prestigious institutes, creating immersive, custom-curated dining experiences right inside your home. Specializing in tableside finishing, artistic plating, and farm-to-table menus."}
                </p>
              </div>

              {/* Dietary Customize Badges */}
              <div className="pt-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Dietary Customizations Supported</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['🌱 Vegan', '🌾 Gluten-Free', '🥩 Keto-Friendly', '🥜 Nut-Free Safe', '🥛 Dairy-Free option'].map((badge) => (
                    <span key={badge} className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chef Signature Touches */}
              <div className="bg-gradient-to-r from-[#FFF8E7] to-amber-50/20 p-3 rounded-xl border border-[#FFC72C]/30 text-xs text-amber-900/90 leading-relaxed space-y-1">
                <p className="font-extrabold flex items-center gap-1.5 text-[#7A0019]">
                  <Sparkles className="w-3.5 h-3.5" /> Signature Tableside Presentation Included
                </p>
                <p className="text-[11px] text-slate-600">Every reservation features full course plating, table service, explanation of culinary inspirations, and complete sanitization cleanup.</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed">
              {vendor.description}
            </p>
          )}
        </div>

        {/* Item 3: Guest Count Slider & Direct Numeric Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <Users className="w-4.5 h-4.5 text-[#7A0019]" /> 1. Guest Count Selection
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Minimum required: {vendor.minGuests} guests</p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 max-w-[120px]">
              <input
                type="number"
                min="5"
                max="500"
                value={guestCount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setGuestCount(val);
                }}
                onBlur={() => {
                  const clamped = Math.min(Math.max(guestCount, 5), 500);
                  setGuestCount(clamped);
                }}
                className="w-full text-center bg-transparent text-sm font-black text-slate-900 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 font-bold shrink-0">Guests</span>
            </div>
          </div>

          <div className="py-1">
            <input
              type="range"
              min="5"
              max="500"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full accent-[#7A0019] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-slate-400 font-extrabold px-1 mt-1.5">
              <span>5 (Min)</span>
              <span>100</span>
              <span>250</span>
              <span>500 (Max)</span>
            </div>
          </div>

          {/* Pricing detail breakdown */}
          <div className="bg-[#FFF8E7] p-3 rounded-xl border border-[#FFC72C]/40 flex justify-between items-center text-xs">
            <span className="text-slate-700 font-semibold">Average Rate per Guest:</span>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-[#800020] text-sm">
                ${bookingMode === 'a_la_carte' && selectedDishes.length > 0 && guestCount > 0 
                  ? (dishesSubtotal / guestCount).toFixed(2) 
                  : activePerGuestRate} / guest
              </span>
            </div>
          </div>
        </div>

        {/* Event Duration Slider (For food trucks & chefs) */}
        {(vendor.category === 'food_truck' || vendor.category === 'private_chef') && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                2. Continuous Service Duration
              </h3>
              <span className="text-xs font-extrabold text-[#7A0019] bg-[#FFF8E7] px-2 py-0.5 rounded-md">
                {durationHours} Hours
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">
              Standard: 2 hrs. Extend continuous service window below.
            </p>

            <div className="space-y-2">
              <input
                type="range"
                min="2"
                max="8"
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7A0019]"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1">
                <span>Standard (2h)</span>
                <span>4h (+$200)</span>
                <span>6h (+$400)</span>
                <span>8h (+$600)</span>
              </div>
            </div>

            {durationHours > standardDuration && (
              <div className="mt-3 text-[10px] text-slate-500 flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Extended hours surcharge: <strong>+${durationFee}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Item 2: Extended Horizon 12-Month Interactive Availability Calendar */}
        <div id="calendar-selection-section" className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <CalendarRange className="w-4.5 h-4.5 text-[#7A0019]" /> 3. Select Event Calendar Date
              </h3>
              <p className="text-[10px] text-slate-400">Lock in date to see availability rates</p>
            </div>

            {/* Month offset controllers */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                disabled={currentMonthOffset <= 0}
                onClick={() => setCurrentMonthOffset(prev => prev - 1)}
                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-black uppercase text-slate-800 px-1 min-w-[75px] text-center">
                {monthName}
              </span>
              <button
                disabled={currentMonthOffset >= 11}
                onClick={() => setCurrentMonthOffset(prev => prev + 1)}
                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Key Guide */}
          <div className="flex space-x-4 text-[9px] font-bold text-slate-400 justify-center bg-slate-50/55 p-2 rounded-xl">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span> Peak Surcharge
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Blocked Out
            </span>
          </div>

          {/* Horizontally Browsable Grid of Days */}
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {activeMonthDays.map((d) => {
              const isBlocked = vendor.blockedDates.includes(d.full);
              const isSelected = selectedDate === d.full;
              const isWeekend = d.day === 'Fri' || d.day === 'Sat' || d.day === 'Sun';

              return (
                <button
                  key={d.full}
                  disabled={isBlocked}
                  onClick={() => setSelectedDate(d.full)}
                  className={`w-12 h-16 rounded-2xl border flex flex-col items-center justify-center shrink-0 transition-all ${
                    isBlocked 
                      ? 'bg-slate-100 border-slate-200 text-slate-300 line-through cursor-not-allowed'
                      : isSelected
                        ? 'bg-[#800020] border-[#800020] text-white shadow-md font-extrabold scale-102'
                        : isWeekend
                          ? 'bg-amber-50/70 border-amber-200 text-amber-800 font-medium'
                          : 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-tight">{d.day}</span>
                  <span className="text-sm font-extrabold mt-0.5">{d.num}</span>
                  {isWeekend && !isBlocked && !isSelected && (
                    <span className="text-[7px] text-amber-600 font-black mt-0.5">PEAK</span>
                  )}
                  {!isWeekend && !isBlocked && !isSelected && (
                    <span className="text-[7px] text-emerald-600 font-black mt-0.5">SAVE</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Hourly Slots Selection Grid with Live Rate Estimators */}
          {selectedDate && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Available Hourly Time Slots</span>
              <div className="grid grid-cols-3 gap-1.5">
                {mockTimes.map((time) => {
                  const isSelected = selectedTime === time;
                  const estimatedSlotRate = activePerGuestRate;

                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`text-xs p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#800020] border-[#800020] text-white font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-extrabold text-[11px]">{time}</span>
                      <span className={`text-[8px] font-bold mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>
                        ${estimatedSlotRate.toFixed(0)}/g rate
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Direct Transparent Pricing View */}
          {selectedDate && selectedTime && (
            <div className="bg-[#FFF8E7] rounded-xl p-3 border border-[#FFC72C]/30 text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Base Food Cost:</span>
                <span className="font-bold">${baseFoodSubtotal.toFixed(2)}</span>
              </div>
              
              {isWeekendSelected() && (
                <div className="flex justify-between text-[#7A0019] font-bold">
                  <span>Weekend rate adjustment (+{vendor.weekendRatePercentage}%):</span>
                  <span>+${(baseFoodSubtotal * (vendor.weekendRatePercentage / 100)).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-black border-t border-[#FFC72C]/20 pt-1.5 text-[#7A0019] text-sm">
                <span>Service Rate locked:</span>
                <span>${Math.round(baseFoodSubtotal * weekendMultiplier).toFixed(2)} total</span>
              </div>
            </div>
          )}
        </div>

        {/* Render booking modes content */}
        {bookingMode === 'custom' ? (
          // Item 5.3: Custom Menu Request flow
          <form onSubmit={handleCustomRequestSubmit} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-3">
            <div>
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                Submit Custom Chef Request
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                Let Chef {vendor.name} cook an exclusive, customizable multi-course menu for your birthday or garden event.
              </p>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase">Target Budget Per Guest</label>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-bold text-slate-600">$30</span>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="flex-1 accent-[#7A0019] h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-black text-[#7A0019]">${customBudget}/guest</span>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase">Allergies / Dietary Needs</label>
              <input
                type="text"
                placeholder="e.g. gluten-free, vegetarian, nut allergies..."
                value={customDiet}
                onChange={(e) => setCustomDiet(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 mt-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase">Inquiry specifics & Notes</label>
              <textarea
                rows={3}
                placeholder="Describe what vibe, themes, or custom course styles you are hoping to plan with the chef..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 mt-1 resize-none focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1 shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire & Start Chat with Chef</span>
            </button>
          </form>
        ) : bookingMode === 'prix_fixe' ? (
          // Item 5.1: Prix-Fixe Menu Card Details
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 space-y-3.5">
            <div>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Prix-Fixe Package
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-2">Chef's Signature 3-Course Dinner Platter</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                A gourmet tableside selection prepared with curated ingredients. Includes dynamic clean-up and catering staff.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <span className="text-xs bg-indigo-50 p-1.5 rounded-lg text-indigo-600 shrink-0 font-extrabold">1</span>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Fresh Seasonal Greens Appetizer</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Plated with aged burrata cheese, roasted pine nuts, and lemon zest oil.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-xs bg-indigo-50 p-1.5 rounded-lg text-indigo-600 shrink-0 font-extrabold">2</span>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Main Tableside Carving Choice</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Slow-braised rosemary beef medallion or hand-seared Atlantic salmon round.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-xs bg-indigo-50 p-1.5 rounded-lg text-indigo-600 shrink-0 font-extrabold">3</span>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Cinnamon Caramel Pastry Tart</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Baked sweet crust filled with organic cream cheese and warm salted caramel.</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl text-center border border-indigo-100">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Fixed Multi-Course Package Rate</span>
              <span className="text-base font-black text-indigo-900">$75 / guest rate</span>
            </div>
          </div>
        ) : (
          // Customizable À La Carte menu booking
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">
                  4. Select Menu Dishes & Portions
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Order exact portions for your event (e.g. half for one entree, half for another)
                </p>
              </div>
            </div>

            {/* Live Portion Tracker */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Total Portions Selected: {totalPortionsSelected}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {totalPortionsSelected === guestCount
                    ? `✨ Perfectly matches your party size of ${guestCount} guests!`
                    : totalPortionsSelected > 0
                      ? `Selected for ${totalPortionsSelected} total servings (${guestCount} guests)`
                      : `Customize dish portion quantities for your ${guestCount} guests below`}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full shrink-0">
                ${dishesSubtotal.toFixed(2)}
              </span>
            </div>

            {/* Category selection bar */}
            <div className="flex border-b border-slate-100 mb-4 pb-2 scroll-x overflow-x-auto no-scrollbar space-x-3">
              {['Appetizers', 'Mains', 'Desserts', 'Drinks'].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`text-xs font-extrabold pb-1.5 transition-colors shrink-0 ${
                      isActive ? 'border-b-2 border-[#7A0019] text-[#7A0019]' : 'text-slate-400 hover:text-[#7A0019]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Menu Items List */}
            <div className="space-y-3.5">
              {vendor.menuItems.filter(item => item.category === activeCategory).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No custom dishes listed in this category.</p>
              ) : (
                vendor.menuItems
                  .filter(item => item.category === activeCategory)
                  .map((item) => {
                    const existingInCart = selectedDishes.find(d => d.item.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenItemModal(item)}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          <div className="w-14 h-14 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                            <span className="text-[11px] font-bold text-slate-800 block mt-1">${item.price}</span>
                          </div>
                        </div>

                        {/* Add button or counter */}
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                          {existingInCart ? (
                            <div className="flex items-center space-x-1.5 bg-[#FFF8E7] text-[#7A0019] p-1.5 rounded-lg border border-[#FFC72C]/40">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="p-1 hover:bg-[#FFF2CC] rounded text-[#7A0019]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-extrabold w-4 text-center">{existingInCart.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="p-1 hover:bg-[#FFF2CC] rounded text-[#7A0019]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenItemModal(item)}
                              className="bg-[#7A0019] text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl shadow-sm hover:bg-[#5E0012] active:scale-90 transition-all flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* Selected Dishes Summary inside Vendor Page */}
        {bookingMode !== 'prix_fixe' && selectedDishes.length > 0 && (
          <div className="bg-[#7A0019] text-white rounded-2xl p-4 shadow-lg space-y-3 border border-[#8A1029]">
            <div className="flex items-center justify-between border-b border-[#8A1029] pb-2">
              <span className="text-[10px] font-extrabold text-[#FFC72C] uppercase tracking-wider block font-mono">
                Selected Items Preview ({selectedDishes.reduce((sum, d) => sum + d.quantity, 0)})
              </span>
              <span className="text-xs font-black text-[#FFC72C]">
                ${dishesSubtotal.toFixed(2)}
              </span>
            </div>

            <div className="divide-y divide-[#8A1029] max-h-48 overflow-y-auto no-scrollbar pr-0.5">
              {selectedDishes.map((dish) => (
                <div key={dish.item.id} className="py-2 flex justify-between items-center text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-100 block truncate">{dish.item.name}</span>
                    <span className="text-slate-300 text-[10px]">x{dish.quantity} (${dish.item.price} ea)</span>
                    {dish.instructions && (
                      <p className="text-[10px] text-slate-300 mt-0.5 font-mono italic">“{dish.instructions}”</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-bold text-[#FFC72C]">${(dish.item.price * dish.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => handleUpdateQuantity(dish.item.id, -1)}
                      className="p-1 hover:bg-[#8A1029] active:scale-90 rounded text-rose-200 transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleUpdateQuantity(dish.item.id, 1)}
                      className="p-1 hover:bg-[#8A1029] active:scale-90 rounded text-rose-200 transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add to Cart Feature under Selected Items Preview */}
            <div className="pt-2.5 border-t border-[#8A1029] space-y-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#FFC72C] hover:bg-[#E5B520] active:scale-[0.98] text-[#5E0012] font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#5E0012] group-hover:scale-110 transition-transform" />
                <span>
                  Add {selectedDishes.reduce((sum, d) => sum + d.quantity, 0)} {selectedDishes.reduce((sum, d) => sum + d.quantity, 0) === 1 ? 'Item' : 'Items'} to Cart • ${dishesSubtotal.toFixed(2)}
                </span>
              </button>
              {(!selectedDate || !selectedTime) && (
                <p className="text-[10px] text-amber-200 text-center font-medium">
                  ⚠️ Select event date & time slot above to complete checkout!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Full-Screen Menu Item Detail Page Overlay */}
      <AnimatePresence>
        {selectedItemModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-0 bg-slate-50 z-[100] flex flex-col h-full w-full overflow-hidden font-sans"
          >
            {/* Top Navigation Header Bar */}
            <div className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shrink-0 flex items-center justify-between px-4 sticky top-0 z-20 shadow-xs">
              <button
                onClick={() => setSelectedItemModal(null)}
                className="flex items-center space-x-2 text-xs font-extrabold text-slate-800 hover:text-[#800020] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-all active:scale-95"
              >
                <ArrowLeft className="w-4.5 h-4.5 text-slate-900" />
                <span>Back to {vendor.name}</span>
              </button>
              <div className="text-center min-w-0 px-2">
                <span className="text-xs font-extrabold text-slate-900 block truncate">{selectedItemModal.name}</span>
                <span className="text-[10px] text-slate-400 font-medium block truncate">{vendor.name}</span>
              </div>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                title="Close and return to vendor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Item Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 no-scrollbar">
              {/* High-res Hero Image Banner */}
              <div className="h-64 bg-slate-900 rounded-3xl overflow-hidden shadow-sm relative border border-slate-200/80 group">
                <img
                  src={selectedItemModal.imageUrl}
                  alt={selectedItemModal.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                {/* Floating Back Arrow Button */}
                <button
                  onClick={() => setSelectedItemModal(null)}
                  className="absolute top-3 left-3 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full shadow-md border border-white/20 transition-all active:scale-90 flex items-center justify-center z-10"
                  title="Back to vendor page"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>

                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className="bg-[#800020] text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-white/20">
                    {selectedItemModal.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-base px-3.5 py-1 rounded-full shadow-md border border-white/40">
                  ${selectedItemModal.price} <span className="text-[10px] font-medium text-slate-500">/ portion</span>
                </div>
              </div>

              {/* Title, Pricing & Detailed Description */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{selectedItemModal.name}</h2>
                  <span className="text-base font-extrabold text-[#800020] shrink-0 ml-2">${selectedItemModal.price}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {selectedItemModal.description || "Handcrafted fresh to order by our culinary staff, using locally sourced premium ingredients and authentic seasoning blends designed for event platters."}
                </p>

                {/* Direct Add to Cart Action */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => handleSaveModalItem()}
                    className="w-full bg-[#800020] hover:bg-[#600018] active:scale-[0.98] text-white py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all shadow-xs flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add to Cart • ${(selectedItemModal.price * (modalQuantity || 1)).toFixed(2)}</span>
                  </button>
                </div>

                {/* Dietary & Preparation Highlights */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200/60">
                    🌱 Fresh Local Produce
                  </span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200/60">
                    ✨ Chef Specialty
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200/60">
                    🍽️ Catering Portion Ready
                  </span>
                </div>
              </div>

              {/* Quantity & Party Fraction Preset Selector Card */}
              <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Portions Needed</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Select exact quantity</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setModalQuantity(Math.max(0, modalQuantity - 1))}
                      className="w-9 h-9 bg-white rounded-xl shadow-xs flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-90 transition-all font-bold shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={modalQuantity}
                      onChange={(e) => setModalQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className="text-base font-extrabold w-12 text-center text-slate-900 bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-9 h-9 bg-white rounded-xl shadow-xs flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-90 transition-all font-bold shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Party Fraction Preset Buttons */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Quick Party Presets ({guestCount} Guests)
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalQuantity(1)}
                      className={`py-2 px-1 text-[11px] font-extrabold rounded-xl border text-center transition-all ${
                        modalQuantity === 1 ? 'bg-[#800020] text-white border-[#800020] shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      1 Portion
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalQuantity(Math.ceil(guestCount / 2))}
                      className={`py-2 px-1 text-[11px] font-extrabold rounded-xl border text-center transition-all ${
                        modalQuantity === Math.ceil(guestCount / 2) ? 'bg-[#800020] text-white border-[#800020] shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      Half Party ({Math.ceil(guestCount / 2)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalQuantity(guestCount)}
                      className={`py-2 px-1 text-[11px] font-extrabold rounded-xl border text-center transition-all ${
                        modalQuantity === guestCount ? 'bg-[#800020] text-white border-[#800020] shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      Full Party ({guestCount})
                    </button>
                  </div>
                </div>

                <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 flex justify-between items-center text-xs">
                  <span className="text-amber-950 font-semibold">Item Subtotal ({modalQuantity} portions):</span>
                  <span className="font-extrabold text-[#800020] text-sm">${(selectedItemModal.price * modalQuantity).toFixed(2)}</span>
                </div>
              </div>

              {/* Special Instructions & Dietary Requests */}
              <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Special Preparation Notes</label>
                <textarea
                  value={modalInstructions}
                  onChange={(e) => setModalInstructions(e.target.value)}
                  placeholder="e.g. Extra dressing on side, nut allergy warning, mild spice..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] resize-none"
                />
              </div>
            </div>

            {/* Fixed Bottom Full Width CTA Bar */}
            <div className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 sticky bottom-0 z-30 shadow-lg">
              <button
                onClick={handleSaveModalItem}
                className="w-full bg-[#800020] hover:bg-[#600018] active:scale-[0.98] text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4.5 h-4.5 text-[#D4AF37]" />
                <span>
                  {modalQuantity > 0 ? `Add to Cart (${modalQuantity}) • $${(selectedItemModal.price * modalQuantity).toFixed(2)}` : 'Remove from Cart'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtotal Preview Bar - Sleek Glass Floating Pill */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-1/2 min-w-[210px] max-w-[260px] bg-slate-900/95 backdrop-blur-md text-white py-2 px-3.5 rounded-full shadow-2xl border border-slate-800 flex items-center justify-between transition-all">
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider leading-none">Total Est.</span>
          <span className="text-xs font-extrabold text-[#D4AF37] truncate mt-0.5">${finalTotal.toFixed(2)}</span>
        </div>

        {bookingMode === 'custom' ? (
          <button
            onClick={() => {
              const el = document.querySelector('form');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#800020] hover:bg-[#600018] text-white font-extrabold text-[10px] py-1.5 px-3 rounded-full shadow-xs transition-all shrink-0 active:scale-95"
          >
            Configure
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="bg-[#800020] hover:bg-[#600018] active:scale-95 text-white font-extrabold text-[10px] py-1.5 px-3 rounded-full shadow-xs transition-all flex items-center space-x-1 shrink-0"
          >
            <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
            <span>Book</span>
          </button>
        )}
      </div>
    </div>
  );
}
