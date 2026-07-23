import { motion, AnimatePresence } from 'motion/react';
import { User, Calendar, Briefcase, Heart, Shield, X, ChevronRight, MapPin, CreditCard, Cloud, Upload } from 'lucide-react';
import { UserAccount } from '../types';
import Logo from './Logo';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  currentView: string;
  onNavigate: (view: string) => void;
  unreadCount?: number;
}

export default function Drawer({ isOpen, onClose, user, currentView, onNavigate, unreadCount = 0 }: DrawerProps) {
  const menuItems = [
    {
      id: 'switch_user',
      label: 'Cloud Sync & Switch User',
      icon: <Cloud className="w-4.5 h-4.5 text-emerald-400" />,
      subtitle: 'Google Cloud multi-user frontend session'
    },
    {
      id: 'cloud_storage',
      label: 'Google Cloud Storage',
      icon: <Upload className="w-4.5 h-4.5 text-[#FFC72C]" />,
      subtitle: 'Upload menus, COI permits & dish photos'
    },
    {
      id: 'account',
      label: 'Manage Account',
      icon: <User className="w-4.5 h-4.5" />,
      subtitle: 'Profile, Saved addresses, Payments'
    },
    {
      id: 'bookings',
      label: 'Bookings & History',
      icon: <Calendar className="w-4.5 h-4.5" />,
      subtitle: 'Reservations & live tracker'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Heart className="w-4.5 h-4.5" />,
      subtitle: 'Saved vendors & dishes'
    },
    {
      id: 'admin_panel',
      label: 'Master Admin Control',
      icon: <Shield className="w-4.5 h-4.5" />,
      subtitle: 'Review & approve vendor profiles'
    },
    {
      id: 'vendor_portal',
      label: 'List Your Business',
      icon: <Briefcase className="w-4.5 h-4.5" />,
      subtitle: 'Vendor onboard & manage calendar'
    }
  ];

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-40"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute top-0 bottom-0 left-0 w-[295px] bg-slate-900 text-white z-50 flex flex-col shadow-2xl rounded-r-3xl overflow-hidden border-r border-slate-800/80"
          >
            {/* Header / User Profile Summary */}
            <div className="p-6 pt-10 pb-5 border-b border-slate-800 bg-gradient-to-b from-[#800020]/30 via-slate-900/80 to-slate-900 relative">
              <button 
                onClick={onClose}
                className="absolute top-8 right-4 p-2 rounded-full hover:bg-slate-800/80 text-slate-400 active:scale-95 transition-all"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>

              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#800020] to-[#D4AF37] flex items-center justify-center font-extrabold text-base text-white shadow-md ring-2 ring-white/10">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-white truncate leading-snug">{user.name}</h3>
                  <p className="text-xs text-[#D4AF37] font-medium truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Quick info labels */}
              <div className="flex items-center space-x-4 mt-4 text-[11px] text-slate-400 font-medium">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{user.savedAddresses.length} Addresses</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user.savedPayments.length} Cards</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 no-scrollbar">
              {menuItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-200 group ${
                      isActive 
                        ? 'bg-[#800020] text-white shadow-md shadow-[#800020]/30 font-bold' 
                        : 'text-slate-300 hover:bg-slate-800/70 active:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive ? 'bg-white/15 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-[#D4AF37]'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold tracking-tight">{item.label}</span>
                        <span className={`block text-[10px] mt-0.5 truncate ${
                          isActive ? 'text-rose-100 font-normal' : 'text-slate-400 font-normal'
                        }`}>
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight className={`w-4 h-4 shrink-0 opacity-70 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-600 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Footer Brand */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <Logo size="sm" onClick={() => handleSelect('home')} />
              <span className="text-[9px] bg-slate-800 text-slate-300 font-bold uppercase px-1.5 py-0.5 rounded-full">v1.4</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

