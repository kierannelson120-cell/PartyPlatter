import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, Mail, Lock, Sparkles, Building, Phone, MapPin, 
  CreditCard, CheckCircle2, ChevronRight, Apple, Globe, ArrowRight
} from 'lucide-react';
import { UserAccount, Vendor, VendorCategory } from '../types';
import Logo from './Logo';

interface AuthScreenProps {
  onAuthSuccess: (user: UserAccount, role: 'Consumer' | 'Vendor') => void;
  existingUser?: UserAccount;
  vendors: Vendor[];
  onPublishVendor: (newVendor: Vendor) => void;
}

export default function AuthScreen({ onAuthSuccess, existingUser, vendors, onPublishVendor }: AuthScreenProps) {
  // Persistence key
  const AUTH_KEY = 'partyplatter_auth';
  const ROLE_KEY = 'partyplatter_role';

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Consumer' | 'Vendor'>('Consumer');

  // Loading animation state
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Consumer Onboarding State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cCardBrand, setCCardBrand] = useState<'Visa' | 'MasterCard' | 'Amex' | 'ApplePay'>('ApplePay');
  const [cCardLast4, setCCardLast4] = useState('4832');

  // Vendor Onboarding State
  const [vBusinessName, setVBusinessName] = useState('');
  const [vCategory, setVCategory] = useState<VendorCategory>('private_chef');
  const [vCuisine, setVCuisine] = useState('Italian');
  const [vBio, setVBio] = useState('');
  const [vRadius, setVRadius] = useState(25);
  const [vBasePrice, setVBasePrice] = useState(65);
  const [vLogoUrl, setVLogoUrl] = useState('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&auto=format&fit=crop&q=80');

  // Success message state
  const [authComplete, setAuthComplete] = useState(false);

  // Check existing session
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    const savedRole = localStorage.getItem(ROLE_KEY) as 'Consumer' | 'Vendor';
    if (savedAuth && savedRole) {
      try {
        const parsedUser = JSON.parse(savedAuth);
        onAuthSuccess(parsedUser, savedRole);
      } catch (e) {
        console.error("Error reading cached auth state", e);
      }
    }
  }, []);

  const handleAppleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const appleUser: UserAccount = {
        name: 'Kieran Nelson',
        email: 'kieran.apple@icloud.com',
        phone: '+1 (555) 234-5678',
        savedAddresses: ['242 Ocean Drive, Apt 4B, South Beach, FL'],
        savedPayments: [{ id: 'pay_a', brand: 'ApplePay', last4: '9901', expiry: '10/28', isDefault: true }]
      };
      finishAuth(appleUser, 'Consumer');
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserAccount = {
        name: 'Kieran Nelson',
        email: 'kierannelson120@gmail.com',
        phone: '+1 (555) 489-3210',
        savedAddresses: ['242 Ocean Drive, Apt 4B, South Beach, FL'],
        savedPayments: [{ id: 'pay_g', brand: 'ApplePay', last4: '4832', expiry: '12/28', isDefault: true }]
      };
      finishAuth(googleUser, 'Consumer');
    }, 1500);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill out all credentials.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isSignUp) {
        // Trigger onboarding wizard
        setShowOnboarding(true);
      } else {
        // Default login
        const loggedUser: UserAccount = {
          name: fullName || 'Kieran Nelson',
          email: email,
          phone: phone || '+1 (555) 489-3210',
          savedAddresses: ['242 Ocean Drive, Apt 4B, South Beach, FL'],
          savedPayments: [{ id: 'pay_1', brand: 'ApplePay', last4: '4832', expiry: '12/28', isDefault: true }]
        };
        finishAuth(loggedUser, selectedRole);
      }
    }, 1200);
  };

  const finishAuth = (userObj: UserAccount, role: 'Consumer' | 'Vendor') => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
    localStorage.setItem(ROLE_KEY, role);
    setAuthComplete(true);
    setTimeout(() => {
      onAuthSuccess(userObj, role);
    }, 1000);
  };

  // Submit Consumer Onboarding Profile
  const handleConsumerOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !cPhone || !cAddress) {
      alert('Please configure your basic event details.');
      return;
    }
    const newUser: UserAccount = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: cPhone,
      savedAddresses: [cAddress],
      savedPayments: [{
        id: `pay_${Date.now()}`,
        brand: cCardBrand,
        last4: cCardLast4,
        expiry: '11/29',
        isDefault: true
      }]
    };
    finishAuth(newUser, 'Consumer');
  };

  // Submit Vendor Storefront Onboarding
  const handleVendorOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vBusinessName || !vBio || !vCuisine) {
      alert('Please fill out your business profile listings.');
      return;
    }

    const newVendorId = `vendor_${vCategory}_${Date.now()}`;
    const newVendor: Vendor = {
      id: newVendorId,
      name: vBusinessName,
      category: vCategory,
      cuisine: vCuisine,
      pricePerGuest: Number(vBasePrice),
      minGuests: 10,
      rating: 5.0,
      ratingCount: 1,
      description: vBio,
      imageUrls: [vLogoUrl, 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80'],
      maxRadius: Number(vRadius),
      pricingNotes: `Standard base rate range starting at $${vBasePrice}/guest. Peak weekends/holidays carry 15% demand surcharge.`,
      customMenuSupported: true,
      weekendRatePercentage: 15,
      blockedDates: [],
      workingHours: { start: '10:00', end: '22:00' },
      locationName: 'Local Service Hub',
      status: 'pending_review',
      menuItems: [
        {
          id: `menu_init_${Date.now()}`,
          name: 'Signature Welcome Appetizer',
          description: 'A curated tasting flight prepared with handpicked seasonal ingredients (included in minimum guests).',
          price: 15,
          category: 'Appetizers',
          imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
        }
      ]
    };

    onPublishVendor(newVendor);

    const newUser: UserAccount = {
      name: vBusinessName,
      email: email,
      phone: '+1 (555) 777-8899',
      savedAddresses: ['100 Vendor Lane, Miami, FL'],
      savedPayments: []
    };

    finishAuth(newUser, 'Vendor');
  };

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-50 flex flex-col justify-center items-center p-6 font-sans">
      
      {/* Background aesthetic decor */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#FFF8E7]/70 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {authComplete ? (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="text-center p-6 space-y-4"
          >
            <div className="w-16 h-16 bg-[#FFF8E7] rounded-full flex items-center justify-center text-[#7A0019] mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Securely Connected!</h3>
            <p className="text-xs text-slate-500 max-w-[240px]">
              Initializing your multi-role interactive digital dining planner...
            </p>
          </motion.div>
        ) : showOnboarding ? (
          // ONBOARDING WIZARDS
          <motion.div
            key="onboarding"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl max-h-[85%] overflow-y-auto no-scrollbar space-y-4"
          >
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-[10px] bg-[#FFF8E7] text-[#7A0019] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selectedRole} Onboarding
              </span>
              <h3 className="text-base font-black text-slate-950 mt-2">Configure Your Profile</h3>
              <p className="text-[11px] text-slate-400">Complete these short steps to enter the platform</p>
            </div>

            {selectedRole === 'Consumer' ? (
              // Consumer onboarding form
              <form onSubmit={handleConsumerOnboardingSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kieran"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#0066FF] mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nelson"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#0066FF] mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#0066FF]" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 489-3210"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#0066FF] mt-1"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0066FF]" /> Default Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 242 Ocean Drive, Apt 4B, South Beach, FL"
                    value={cAddress}
                    onChange={(e) => setCAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#0066FF] mt-1"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-emerald-500" /> Preferred Payment Method
                  </label>
                  <div className="grid grid-cols-4 gap-1 mt-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    {(['Visa', 'MasterCard', 'Amex', 'ApplePay'] as const).map(brand => (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => setCCardBrand(brand)}
                        className={`py-1 rounded-lg text-[9px] font-bold transition-all ${
                          cCardBrand === brand ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {brand === 'ApplePay' ? ' Pay' : brand}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-1"
                >
                  <span>Complete & Start Planning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              // Vendor / Publish Storefront Portal onboarding form
              <form onSubmit={handleVendorOnboardingSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Business/Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bella Italia Catering"
                    value={vBusinessName}
                    onChange={(e) => setVBusinessName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Service Type</label>
                    <select
                      value={vCategory}
                      onChange={(e) => setVCategory(e.target.value as VendorCategory)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none mt-1"
                    >
                      <option value="private_chef">👨‍🍳 Private Chef</option>
                      <option value="caterer">🍽️ Catering Co.</option>
                      <option value="food_truck">🚚 Food Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Cuisine Genre</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Italian fusion"
                      value={vCuisine}
                      onChange={(e) => setVCuisine(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Store Bio & Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Briefly describe your signature dishes, culinary staff, and event presence..."
                    value={vBio}
                    onChange={(e) => setVBio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] mt-1 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Radius (mi)</label>
                      <span className="text-[10px] font-extrabold text-[#7A0019]">{vRadius}m</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={vRadius}
                      onChange={(e) => setVRadius(Number(e.target.value))}
                      className="w-full mt-1 accent-[#7A0019]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Base / Guest</label>
                      <span className="text-[10px] font-extrabold text-emerald-600">${vBasePrice}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="250"
                      value={vBasePrice}
                      onChange={(e) => setVBasePrice(Number(e.target.value))}
                      className="w-full mt-1 accent-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Logo/Header Image URL</label>
                  <input
                    type="url"
                    placeholder="Paste unspash URL..."
                    value={vLogoUrl}
                    onChange={(e) => setVLogoUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-1"
                >
                  <span>Publish Interactive Storefront</span>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                </button>
              </form>
            )}

            <button
              onClick={() => setShowOnboarding(false)}
              className="w-full text-center text-[10px] text-slate-400 hover:text-slate-600 font-bold"
            >
              Back to main credentials
            </button>
          </motion.div>
        ) : (
          // MAIN SIGN IN SCREEN
          <motion.div
            key="login"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-xl space-y-5"
          >
            {/* Header branding */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 bg-gradient-to-tr from-[#7A0019]/10 via-amber-500/5 to-transparent rounded-3xl flex items-center justify-center text-[#7A0019] mx-auto shadow-inner border border-amber-100/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7A0019]/20 to-[#FFC72C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Sparkles className="w-7 h-7 text-[#7A0019] fill-[#FFF8E7] animate-pulse relative z-10" />
              </div>
              <div className="flex justify-center py-1">
                <Logo size="lg" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 max-w-[280px] mx-auto leading-normal">
                Exclusive Event Catering & Private Chef Marketplace
              </p>
            </div>

            {/* Simulated Dual-Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedRole('Consumer')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'Consumer'
                    ? 'bg-white text-[#7A0019] shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Consumer Client</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('Vendor')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'Vendor'
                    ? 'bg-white text-[#7A0019] shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Vendor/Chef</span>
              </button>
            </div>

            {/* Social Authentication buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full bg-black hover:bg-slate-900 text-white text-xs font-bold py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <Apple className="w-4.5 h-4.5 text-white" />
                <span>Continue with Apple Sign-In</span>
              </button>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-3 px-4 rounded-2xl border border-slate-200 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <Globe className="w-4.5 h-4.5 text-[#D4AF37]" />
                <span>Continue with Google Sign-In</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase px-1">
              <span className="h-px bg-slate-100 flex-1" />
              <span className="px-3">Or Email Access</span>
              <span className="h-px bg-slate-100 flex-1" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="First and Last Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] mt-1"
                  />
                </div>
              )}

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] mt-1"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Secret Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-3 rounded-2xl shadow-md flex items-center justify-center space-x-1 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Role Account & Onboard' : 'Secure Email Sign In'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle sign in / sign up */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[11px] font-semibold text-[#7A0019] hover:underline"
              >
                {isSignUp ? 'Already registered? Login here' : "First time? Join PartyPlatter today"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security standard shield badge */}
      <div className="absolute bottom-6 flex items-center space-x-1 text-[10px] text-slate-400 font-bold bg-white/60 p-1.5 px-3 rounded-full border border-slate-200">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>SIMULATED RSA-256 SECURE AUTHENTICATION</span>
      </div>
    </div>
  );
}
