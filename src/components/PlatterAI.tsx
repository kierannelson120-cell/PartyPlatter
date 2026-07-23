import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, ArrowLeft, Calendar as CalendarIcon, DollarSign, MapPin, Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Vendor, UserAccount } from '../types';

interface PlatterAIProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: Vendor[];
  user: UserAccount;
  onVendorSelect: (vendor: Vendor) => void;
  savedAddress: string;
  setSavedAddress: (addr: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
  type?: 'address' | 'category' | 'date' | 'time' | 'budget' | 'cuisine' | 'results' | 'text';
}

export default function PlatterAI({
  isOpen,
  onClose,
  vendors,
  user,
  onVendorSelect,
  savedAddress,
  setSavedAddress
}: PlatterAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);

  // Filter criteria states
  const [selectedAddress, setSelectedAddress] = useState(savedAddress || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  
  // Filtered matching list
  const [matchedVendors, setMatchedVendors] = useState<Vendor[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Distance calculator helper
  const getMockDistance = (vendorId: string) => {
    const distances: Record<string, number> = {
      'caterer_1': 12,
      'caterer_2': 18,
      'food_truck_1': 28,
      'food_truck_2': 14,
      'chef_1': 8,
      'chef_2': 11
    };
    return distances[vendorId] || 15;
  };

  // Perform filtering algorithm
  const performFiltering = () => {
    return vendors.filter(vendor => {
      // 1. Distance check
      const dist = getMockDistance(vendor.id);
      if (dist > vendor.maxRadius) return false;

      // 2. Category check
      if (selectedCategory && selectedCategory !== 'No Preference') {
        const catMap: Record<string, string> = {
          'Caterers': 'caterer',
          'Food Trucks': 'food_truck',
          'Private Chefs': 'private_chef'
        };
        const targetCategory = catMap[selectedCategory];
        if (targetCategory && vendor.category !== targetCategory) return false;
      }

      // 3. Date availability check
      if (selectedDate && selectedDate !== 'No Preference') {
        if (vendor.blockedDates.includes(selectedDate)) return false;
      }

      // 4. Time slot check
      if (selectedTimeSlot && selectedTimeSlot !== 'No Preference') {
        // Parse vendor work hours
        const vStart = parseInt(vendor.workingHours.start.split(':')[0]);
        const vEnd = parseInt(vendor.workingHours.end.split(':')[0]);

        // Slot ranges: Morning [6-12], Midday [10-14], Afternoon [12-17], Evening [17-24]
        // Match if work hours overlap at least 1 hour
        let matchesSlot = false;
        if (selectedTimeSlot === 'Morning [6am-12pm]') {
          matchesSlot = (vStart < 12 && vEnd > 6);
        } else if (selectedTimeSlot === 'Midday [10am-2pm]') {
          matchesSlot = (vStart < 14 && vEnd > 10);
        } else if (selectedTimeSlot === 'Afternoon [12pm-5pm]') {
          matchesSlot = (vStart < 17 && vEnd > 12);
        } else if (selectedTimeSlot === 'Evening [5pm-12am]') {
          matchesSlot = (vStart < 24 && vEnd > 17);
        } else if (selectedTimeSlot === 'All Day') {
          matchesSlot = true;
        }
        if (!matchesSlot) return false;
      }

      // 5. Budget check
      if (selectedBudget && selectedBudget !== 'No Preference') {
        const cost = vendor.pricePerGuest;
        if (selectedBudget === '< $25 / person') {
          if (cost >= 25) return false;
        } else if (selectedBudget === '$25 - $50 / person') {
          if (cost < 25 || cost > 50) return false;
        } else if (selectedBudget === '$50+ / person') {
          if (cost <= 50) return false;
        }
      }

      // 6. Cuisine check
      if (selectedCuisine && selectedCuisine !== 'No Preference') {
        if (selectedCuisine === 'Flexible / Multi-Cuisine') {
          // Flexible fits anything, but mostly chefs with "Flexible" or "Multi-Cuisine"
          if (vendor.cuisine !== 'Flexible' && vendor.cuisine !== 'American' && vendor.cuisine !== 'Asian' && vendor.cuisine !== 'Sushi') return false;
        } else {
          const rawCuisine = selectedCuisine.replace(/[^a-zA-Z]/g, '').trim(); // strip emojis
          // Check substring match
          if (!vendor.cuisine.toLowerCase().includes(rawCuisine.toLowerCase()) && vendor.cuisine !== 'Flexible') {
            return false;
          }
        }
      }

      return true;
    });
  };

  // Scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initial prompt
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (!selectedAddress) {
          setMessages([
            {
              id: 'init_1',
              sender: 'ai',
              text: "Hey there! I'm PlatterAI, your personal event dining expert. Let's find you the perfect food match for your event! ✨\n\nFirst, what address would you like to use for your event today?",
              options: user.savedAddresses,
              type: 'address'
            }
          ]);
          setStep(1);
        } else {
          setMessages([
            {
              id: 'init_1a',
              sender: 'ai',
              text: `Hey there! I'm PlatterAI, your personal event dining expert. Let's find you the perfect food match for your event! ✨\n\nI see your address is set to: **${selectedAddress}**.\n\nWhat category of vendor are you looking for?`,
              options: ['Caterers', 'Food Trucks', 'Private Chefs', 'No Preference'],
              type: 'category'
            }
          ]);
          setStep(2);
        }
      }, 1000);
    }
  }, [isOpen]);

  // Handle flow transitions
  const handleResponse = (option: string) => {
    // Add user response
    const newUserMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: option
    };
    setMessages(prev => [...prev, newUserMsg]);

    setIsTyping(true);

    // Dynamic dialogue steps
    setTimeout(() => {
      setIsTyping(false);
      let nextMsgText = '';
      let nextOptions: string[] = [];
      let nextType: Message['type'] = 'text';
      let nextStep = step;

      if (step === 1) {
        // Saved Address input step
        setSelectedAddress(option);
        setSavedAddress(option);
        nextMsgText = "Excellent address! Location is verified.\n\nNow, what category of dining experience do you want?";
        nextOptions = ['Caterers', 'Food Trucks', 'Private Chefs', 'No Preference'];
        nextType = 'category';
        nextStep = 2;
      } else if (step === 2) {
        // Category selection
        setSelectedCategory(option);
        nextMsgText = "Great! What is your planned event date? Let me make sure we filter out booked vendors.";
        nextOptions = ['2026-07-25', '2026-07-28', '2026-08-15', 'No Preference']; // simulated dates
        nextType = 'date';
        nextStep = 3;
      } else if (step === 3) {
        // Date selection
        setSelectedDate(option);
        nextMsgText = "Perfect date locked in. What time slot works best for your dining experience?";
        nextOptions = [
          'Morning [6am-12pm]',
          'Midday [10am-2pm]',
          'Afternoon [12pm-5pm]',
          'Evening [5pm-12am]',
          'No Preference'
        ];
        nextType = 'time';
        nextStep = 4;
      } else if (step === 4) {
        // Time slot selection
        setSelectedTimeSlot(option);
        nextMsgText = "Got it! What is your preferred budget range per guest?";
        nextOptions = [
          '< $25 / person',
          '$25 - $50 / person',
          '$50+ / person',
          'No Preference'
        ];
        nextType = 'budget';
        nextStep = 5;
      } else if (step === 5) {
        // Budget selection
        setSelectedBudget(option);
        nextMsgText = "Awesome! Lastly, do you have a specific cuisine craving?";
        if (selectedCategory === 'Private Chefs') {
          nextMsgText += "\n\n💡 *Tip: Private Chefs can often craft custom menus across multiple cuisines—you can select 'Flexible' if you'd like open options.*";
        }
        nextOptions = [
          '🍕 Italian',
          '🌮 Mexican',
          '🍣 Sushi',
          '🍔 American',
          'Flexible / Multi-Cuisine',
          'No Preference'
        ];
        nextType = 'cuisine';
        nextStep = 6;
      } else if (step === 6) {
        // Cuisine selection - FINAL STEP, compute results!
        setSelectedCuisine(option);
        nextStep = 7;
      }

      setStep(nextStep);

      if (nextStep < 7) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: nextMsgText,
            options: nextOptions,
            type: nextType
          }
        ]);
      }
    }, 1200);
  };

  // Run final calculation when step reaches 7
  useEffect(() => {
    if (step === 7) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const filtered = performFiltering();
        setMatchedVendors(filtered);
        setShowResults(true);

        const summaryText = filtered.length > 0 
          ? `Bingo! I ran our behind-the-scenes matchmaking filter against ${vendors.length} vendors based in your area.\n\nI found **${filtered.length} perfect match${filtered.length > 1 ? 'es' : ''}** within your parameters!\n\nTake a look at these matched cards below:`
          : "Ah! It looks like we didn't find any direct matches that meet all those strict constraints. Let's adjust our filters, or select 'Flexible' options to see available local favorites!";

        setMessages(prev => [
          ...prev,
          {
            id: `ai_results_${Date.now()}`,
            sender: 'ai',
            text: summaryText,
            type: 'results',
            options: filtered.length > 0 ? [] : ['Restart Planner', 'Relax Filters']
          }
        ]);
      }, 1000);
    }
  }, [step, selectedCuisine]);

  // Restart AI Planner
  const handleRestart = () => {
    setMessages([]);
    setStep(0);
    setShowResults(false);
    setSelectedCategory(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedBudget(null);
    setSelectedCuisine(null);
    // Triggers initial state again in useEffect
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const txt = inputText.trim();
    setInputText('');

    if (step === 1) {
      handleResponse(txt);
    } else {
      // Freeform chat text typing simulation
      const userMsg: Message = {
        id: `usr_text_${Date.now()}`,
        sender: 'user',
        text: txt,
        type: 'text'
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: `ai_free_${Date.now()}`,
            sender: 'ai',
            text: `I hear you! Let's complete the step-by-step matchmaking so I can filter accurately. We are currently configuring your event details! 🥂`,
            options: messages[messages.length - 1]?.options || []
          }
        ]);
      }, 1000);
    }
  };

  const handleAdjustFilters = () => {
    handleRestart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="absolute inset-0 bg-slate-50 z-50 flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 pt-6 shrink-0 shadow-md flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#800020]/30 backdrop-blur-md rounded-2xl ring-1 ring-[#800020]/50">
                <Sparkles className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">PlatterAI Concierge</h3>
                <p className="text-[10px] text-[#D4AF37] font-medium">Smart event & catering matchmaker</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Profile Label */}
                <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider px-1">
                  {msg.sender === 'ai' && (
                    <>
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>PlatterAI</span>
                    </>
                  )}
                  {msg.sender === 'user' && <span>You</span>}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#800020] text-white rounded-tr-xs font-semibold'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 font-medium'
                  }`}
                >
                  <span className="whitespace-pre-line">
                    {msg.text.includes('**') 
                      ? msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-[#800020] font-extrabold">{chunk}</strong> : chunk)
                      : msg.text}
                  </span>
                </div>

                {/* Interactive Option Chips */}
                {msg.sender === 'ai' && msg.options && msg.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 max-w-[90%]">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === 'Restart Planner' || opt === 'Relax Filters') {
                            handleRestart();
                          } else {
                            handleResponse(opt);
                          }
                        }}
                        className="bg-white hover:bg-[#800020]/5 active:scale-95 text-[#800020] border border-[#800020]/20 hover:border-[#800020] rounded-full py-2 px-4 text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
                      >
                        {opt.includes('🍕') || opt.includes('🌮') || opt.includes('🍣') || opt.includes('🍔') ? (
                          <span>{opt}</span>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 shrink-0 text-[#800020]" />
                            <span>{opt}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Simulated Typist indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-1 mb-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                  <Sparkles className="w-3 h-3 text-[#FFC72C]" />
                  <span>PlatterAI Typing</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 px-4 rounded-tl-none shadow-sm flex items-center space-x-1.5 h-9">
                  <div className="w-1.5 h-1.5 bg-[#7A0019] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#7A0019] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-[#7A0019] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {/* Results swipe cards */}
            {showResults && matchedVendors.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-3 px-1">
                  Matched Vendors ({matchedVendors.length})
                </span>
                
                {/* Horizontal Swipe Rail */}
                <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
                  {matchedVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="w-[260px] bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 shrink-0 snap-center"
                    >
                      {/* Image */}
                      <div className="relative h-28 bg-slate-200">
                        <img
                          src={vendor.imageUrls[0]}
                          alt={vendor.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-[10px] font-extrabold px-2.5 py-1 rounded-full text-slate-900 shadow-sm">
                          {vendor.category === 'caterer' && 'Caterer'}
                          {vendor.category === 'food_truck' && 'Food Truck'}
                          {vendor.category === 'private_chef' && 'Private Chef'}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#FFF8E7] text-[#7A0019] font-bold text-[10px] px-2 py-0.5 rounded-md">
                            {vendor.cuisine}
                          </span>
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-bold ml-0.5">{vendor.rating}</span>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-950 mt-1.5 truncate">
                          {vendor.name}
                        </h4>

                        <div className="flex items-center text-[11px] text-slate-500 mt-1 space-x-3 font-medium">
                          <div className="flex items-center space-x-0.5">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            <span>{vendor.pricePerGuest}/guest</span>
                          </div>
                          <div className="flex items-center space-x-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{getMockDistance(vendor.id)} mi</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {vendor.description}
                        </p>

                        <button
                          onClick={() => onVendorSelect(vendor)}
                          className="w-full mt-3 bg-[#7A0019] hover:bg-[#5E0012] active:scale-95 text-white py-2 rounded-xl text-[11px] font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
                        >
                          <span>View Marketplace Page</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback Follow Up */}
                <div className="mt-4 bg-[#FFF8E7] rounded-2xl p-4 border border-[#FFC72C]/30 flex flex-col space-y-2.5">
                  <p className="text-xs text-[#7A0019] leading-relaxed font-semibold">
                    ✨ *Do these matches look good for your event, or would you like to adjust any filters?*
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAdjustFilters}
                      className="bg-white text-[#7A0019] text-[10px] font-extrabold px-3 py-2 rounded-xl border border-[#FFC72C]/40 shadow-sm active:scale-95 transition-transform"
                    >
                      Adjust Event Details
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-[#7A0019] text-white text-[10px] font-extrabold px-3 py-2 rounded-xl shadow-sm active:scale-95 transition-transform"
                    >
                      These look amazing!
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat text bar input */}
          <form 
            onSubmit={handleInputSubmit}
            className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={step === 1 ? 'Type address here...' : 'Say something to PlatterAI...'}
              className="flex-1 bg-slate-100 rounded-full py-2 px-4 text-xs text-slate-800 border border-slate-200/60 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-[#7A0019] text-white rounded-full disabled:bg-slate-200 disabled:text-slate-400 active:scale-90 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


