import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Phone, Mail, MapPin, CreditCard, ChevronRight, Plus, 
  Trash2, ShieldCheck, Heart, LogOut, Check, Key, Lock, CheckCircle2,
  RefreshCw, AlertCircle, Eye, EyeOff, Send, Cloud, Upload
} from 'lucide-react';
import { UserAccount } from '../types';
import CloudUploadModal from './CloudUploadModal';

interface AccountViewProps {
  user: UserAccount;
  setUser: React.Dispatch<React.SetStateAction<UserAccount>>;
  userRole: 'Consumer' | 'Vendor';
  onSignOut: () => void;
  onSwitchRole: (newRole: 'Consumer' | 'Vendor') => void;
}

export default function AccountView({ user, setUser, userRole, onSignOut, onSwitchRole }: AccountViewProps) {
  // Toggle states
  const [editingProfile, setEditingProfile] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newEmail, setNewEmail] = useState(user.email);

  // Address add form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');

  // Payment add form
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [cardBrand, setCardBrand] = useState<'Visa' | 'MasterCard' | 'Amex'>('Visa');
  const [cardLast4, setCardLast4] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  // Password reset via email state
  const [resetStep, setResetStep] = useState<'idle' | 'sending' | 'verifying' | 'success'>('idle');
  const [sentCode, setSentCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSendResetEmail = () => {
    setResetError(null);
    setResetStep('sending');
    
    // Simulate email dispatch
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      setResetStep('verifying');
      triggerToast(`Confirmation email sent to ${user.email}! 📧`);
    }, 1200);
  };

  const handleVerifyAndResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);

    if (inputCode.trim() !== sentCode) {
      setResetError('Invalid 6-digit confirmation code. Please check your email or resend.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    // Success
    setResetStep('success');
    triggerToast('Password reset successfully! 🔐');
  };

  const handleResetForm = () => {
    setResetStep('idle');
    setInputCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError(null);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: newName,
      phone: newPhone,
      email: newEmail
    }));
    setEditingProfile(false);
    triggerToast('Profile updated successfully! 👤');
  };

  const handleAddAddress = () => {
    if (!addressInput.trim()) return;
    setUser(prev => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, addressInput.trim()]
    }));
    setAddressInput('');
    setShowAddAddress(false);
    triggerToast('Added new service address!');
  };

  const handleDeleteAddress = (idx: number) => {
    setUser(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter((_, i) => i !== idx)
    }));
    triggerToast('Address deleted.');
  };

  const handleAddPayment = () => {
    if (cardLast4.length !== 4 || !cardExpiry) {
      alert('Please enter a valid 4-digit card ending and expiry.');
      return;
    }
    const newCard = {
      id: `pay_${Date.now()}`,
      brand: cardBrand,
      last4: cardLast4,
      expiry: cardExpiry,
      isDefault: user.savedPayments.length === 0
    };
    setUser(prev => ({
      ...prev,
      savedPayments: [...prev.savedPayments, newCard]
    }));
    setCardLast4('');
    setCardExpiry('');
    setShowAddPayment(false);
    triggerToast('Added new payment method! 💳');
  };

  const handleDeletePayment = (id: string) => {
    setUser(prev => ({
      ...prev,
      savedPayments: prev.savedPayments.filter(p => p.id !== id)
    }));
    triggerToast('Payment method removed.');
  };

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-30 flex flex-col overflow-y-auto no-scrollbar pb-20">
      {/* Top Header */}
      <div className="bg-white text-slate-800 p-4 shrink-0 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-[#7A0019]" />
          <h3 className="text-base font-bold text-slate-900">Manage Account</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Personal Details</h4>
            <button
              onClick={() => {
                if (editingProfile) {
                  handleSaveProfile();
                } else {
                  setEditingProfile(true);
                }
              }}
              className="text-xs font-extrabold text-[#7A0019] hover:text-[#5E0012]"
            >
              {editingProfile ? 'Save Changes' : 'Edit'}
            </button>
          </div>

          {editingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{user.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-800 truncate">{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-800 truncate">{user.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Google Cloud Storage Card */}
        <div className="bg-gradient-to-r from-[#7A0019] via-[#8A1029] to-[#5E0012] text-white rounded-2xl p-4 shadow-md space-y-3 border border-[#8A1029]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-white/10 text-[#FFC72C]">
                <Cloud className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#FFC72C] font-mono">Google Cloud File Repository</h4>
                <p className="text-[11px] text-rose-100">Upload & manage menus, venue permits, COIs & dish media</p>
              </div>
            </div>

            <button
              onClick={() => setShowCloudModal(true)}
              className="bg-[#FFC72C] hover:bg-[#E5B520] active:scale-95 text-[#5E0012] font-black text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Open Cloud</span>
            </button>
          </div>
        </div>

        {/* Addresses list */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Service Addresses</h4>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="p-1 text-[#7A0019] hover:bg-[#FFF8E7] rounded-lg active:scale-90 transition-all"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>

          {showAddAddress && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <input
                type="text"
                placeholder="Enter full address and postal code..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddAddress}
                  className="flex-1 bg-[#7A0019] text-white text-[11px] font-bold py-2 rounded-xl"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setShowAddAddress(false)}
                  className="bg-slate-200 text-slate-600 text-[11px] font-bold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
            {user.savedAddresses.map((addr, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700"
              >
                <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                  <MapPin className="w-4 h-4 text-[#7A0019] shrink-0 mt-0.5" />
                  <span className="truncate leading-tight font-medium">{addr}</span>
                </div>
                <button 
                  onClick={() => handleDeleteAddress(idx)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded active:scale-90 transition-transform shrink-0"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Payment Methods</h4>
            <button
              onClick={() => setShowAddPayment(!showAddPayment)}
              className="p-1 text-[#7A0019] hover:bg-[#FFF8E7] rounded-lg active:scale-90 transition-all"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
          </div>

          {showAddPayment && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                {(['Visa', 'MasterCard', 'Amex'] as const).map(brand => (
                  <button
                    key={brand}
                    onClick={() => setCardBrand(brand)}
                    className={`py-1 rounded-lg text-[10px] font-extrabold ${
                      cardBrand === brand ? 'bg-slate-900 text-white' : 'text-slate-500'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleAddPayment}
                  className="flex-1 bg-[#7A0019] text-white text-[11px] font-bold py-2 rounded-xl"
                >
                  Save Method
                </button>
                <button
                  onClick={() => setShowAddPayment(false)}
                  className="bg-slate-200 text-slate-600 text-[11px] font-bold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {user.savedPayments.map((p) => (
              <div 
                key={p.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-800">{p.brand} ending in •••• {p.last4}</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Expires: {p.expiry} {p.isDefault && '• (Default)'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletePayment(p.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded active:scale-90 transition-transform shrink-0"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Confirmation Password Reset Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#7A0019]" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Security & Password Reset</h4>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Email Verified
            </span>
          </div>

          {resetStep === 'idle' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-800">Need to update or reset your password?</p>
                <p className="text-[11px] text-slate-500">
                  Request a secure password reset link and 6-digit confirmation code delivered directly to <span className="font-bold text-slate-700">{user.email}</span>.
                </p>
              </div>

              <button
                onClick={handleSendResetEmail}
                className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
              >
                <Mail className="w-4 h-4" />
                <span>Send Password Reset Email Confirmation</span>
              </button>
            </div>
          )}

          {resetStep === 'sending' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-2 text-center">
              <RefreshCw className="w-5 h-5 text-[#7A0019] animate-spin" />
              <span className="text-xs font-bold text-slate-700">Dispatching reset confirmation email to {user.email}...</span>
            </div>
          )}

          {resetStep === 'verifying' && (
            <form onSubmit={handleVerifyAndResetPassword} className="space-y-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/80">
              <div className="flex items-start space-x-2 text-amber-900 text-xs bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
                <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Confirmation Email Sent!</p>
                  <p className="text-[10px] text-amber-800">
                    We sent a 6-digit code to <span className="font-semibold">{user.email}</span>.
                  </p>
                  <p className="text-[9px] font-mono text-amber-700 mt-1 bg-amber-200/60 px-1.5 py-0.5 rounded inline-block">
                    Demo Security Code: <span className="font-bold">{sentCode}</span>
                  </p>
                </div>
              </div>

              {resetError && (
                <div className="flex items-center space-x-1.5 text-red-600 bg-red-50 p-2 rounded-xl text-[11px] font-semibold border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  1. Enter 6-Digit Email Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 749201"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs tracking-widest font-mono font-bold text-slate-900 focus:outline-none focus:border-[#7A0019]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  2. Create New Password
                </label>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 pr-9 text-xs focus:outline-none focus:border-[#7A0019]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#7A0019]"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-[#7A0019] hover:bg-[#5E0012] text-white text-[11px] font-bold py-2.5 rounded-xl shadow-sm transition-all"
                >
                  Verify Code & Reset Password
                </button>
                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold py-2.5 px-3 rounded-xl hover:bg-slate-50"
                  title="Resend email code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="bg-slate-200 text-slate-600 text-[11px] font-bold py-2.5 px-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {resetStep === 'success' && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-center">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h5 className="text-xs font-bold text-emerald-950">Password Successfully Reset!</h5>
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                Your password has been updated. A confirmation receipt was emailed to <span className="font-semibold">{user.email}</span>.
              </p>
              <button
                onClick={handleResetForm}
                className="mt-2 bg-emerald-700 text-white text-[10px] font-extrabold py-2 px-4 rounded-xl hover:bg-emerald-800"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Security / Standards Info block */}
        <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-r-2xl rounded-l-md shadow-sm space-y-1">
          <h5 className="text-xs font-bold flex items-center space-x-1.5 text-slate-800">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            <span>PlatterPay Secure Encryption</span>
          </h5>
          <p className="text-[10px] text-slate-500 leading-normal">
            PartyPlatter employs advanced iOS Keychain & tokenized payment encryption. Fully compliant with modern consumer safety.
          </p>
        </div>

        {/* Item 1: Dual-Role Switcher and Session Logout Panel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identity & Session Settings</span>
          
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="font-extrabold text-slate-800 block">Active Role Mode</span>
              <p className="text-[9px] text-slate-400 mt-0.5">Currently navigating as {userRole}</p>
            </div>
            <button
              onClick={() => {
                const targetRole = userRole === 'Consumer' ? 'Vendor' : 'Consumer';
                onSwitchRole(targetRole);
                triggerToast(`Role toggled to ${targetRole}!`);
              }}
              className="bg-[#7A0019] hover:bg-[#5E0012] text-white text-[10px] font-black py-2 px-3 rounded-lg shadow-sm transition-all"
            >
              Switch to {userRole === 'Consumer' ? 'Vendor Portal' : 'Consumer Client'}
            </button>
          </div>

          <button
            onClick={onSignOut}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs py-3 rounded-xl border border-red-200 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of PartyPlatter</span>
          </button>
        </div>

      </div>

      {/* Google Cloud Upload Modal */}
      <CloudUploadModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        userRole={userRole}
      />

      {/* Persistence Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-16 left-4 right-4 bg-slate-900 text-white text-[11px] font-semibold py-2.5 px-4 rounded-xl shadow-xl flex items-center justify-center space-x-2 border border-slate-800 z-50 text-center"
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
