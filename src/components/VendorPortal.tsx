import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, Settings, Plus, Trash2, Calendar as CalendarIcon, Clock, 
  MapPin, DollarSign, Upload, Percent, Check, AlertCircle, Sparkles, ChevronRight, Cloud 
} from 'lucide-react';
import { Vendor, MenuItem } from '../types';
import { saveVendorToFirestore } from '../firebase';
import CloudUploadModal from './CloudUploadModal';

interface VendorPortalProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  onClose: () => void;
}

export default function VendorPortal({ vendors, setVendors, onClose }: VendorPortalProps) {
  // We can simulate managing the first vendor, or allowing them to edit 'Chef Marco Rossi' or 'Gourmet Garden'
  const [activeTab, setActiveTab] = useState<'profile' | 'pricing' | 'menu' | 'calendar'>('profile');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('chef_1'); // Chef Marco Rossi as default login

  const currentVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];

  // Profile forms
  const [desc, setDesc] = useState(currentVendor.description);
  const [radius, setRadius] = useState(currentVendor.maxRadius);
  const [loc, setLoc] = useState(currentVendor.locationName);

  // Pricing forms
  const [priceRange, setPriceRange] = useState(currentVendor.pricePerGuest);
  const [minGuests, setMinGuests] = useState(currentVendor.minGuests);
  const [weekendSurcharge, setWeekendSurcharge] = useState(currentVendor.weekendRatePercentage);

  // Calendar forms
  const [workStart, setWorkStart] = useState(currentVendor.workingHours.start);
  const [workEnd, setWorkEnd] = useState(currentVendor.workingHours.end);
  const [blockedInput, setBlockedInput] = useState('');

  // Menu item adding form
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCat, setNewDishCat] = useState<'Appetizers' | 'Mains' | 'Desserts' | 'Drinks'>('Mains');
  const [newDishImg, setNewDishImg] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80');

  const [showCloudModal, setShowCloudModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Profile Save
  const handleSaveProfile = () => {
    const updated = {
      ...currentVendor,
      description: desc,
      maxRadius: radius,
      locationName: loc
    };
    setVendors(prev => prev.map(v => v.id === currentVendor.id ? updated : v));
    saveVendorToFirestore(updated);
    showToast('Business profile updated successfully! 🎉');
  };

  // Pricing Save
  const handleSavePricing = () => {
    const updated = {
      ...currentVendor,
      pricePerGuest: Number(priceRange),
      minGuests: Number(minGuests),
      weekendRatePercentage: Number(weekendSurcharge)
    };
    setVendors(prev => prev.map(v => v.id === currentVendor.id ? updated : v));
    saveVendorToFirestore(updated);
    showToast('Pricing configurations updated successfully! 💸');
  };

  // Menu Add Item
  const handleAddDish = () => {
    if (!newDishName || !newDishPrice) {
      alert('Please fill out dish name and price');
      return;
    }

    const newDish: MenuItem = {
      id: `dish_${Date.now()}`,
      name: newDishName,
      description: newDishDesc,
      price: Number(newDishPrice),
      category: newDishCat,
      imageUrl: newDishImg
    };

    const updated = {
      ...currentVendor,
      menuItems: [...currentVendor.menuItems, newDish]
    };

    setVendors(prev => prev.map(v => v.id === currentVendor.id ? updated : v));
    saveVendorToFirestore(updated);

    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
    showToast(`Added "${newDish.name}" to menu category! 🍽️`);
  };

  // Menu Delete Item
  const handleDeleteDish = (dishId: string) => {
    const updated = {
      ...currentVendor,
      menuItems: currentVendor.menuItems.filter(m => m.id !== dishId)
    };
    setVendors(prev => prev.map(v => v.id === currentVendor.id ? updated : v));
    saveVendorToFirestore(updated);
    showToast('Menu item removed.');
  };

  // Block out dates
  const handleBlockDate = () => {
    if (!blockedInput) return;
    setVendors(prev => prev.map(v => {
      if (v.id === currentVendor.id) {
        if (v.blockedDates.includes(blockedInput)) return v;
        return {
          ...v,
          blockedDates: [...v.blockedDates, blockedInput]
        };
      }
      return v;
    }));
    setBlockedInput('');
    showToast('Calendar date blocked.');
  };

  const handleUnblockDate = (dt: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === currentVendor.id) {
        return {
          ...v,
          blockedDates: v.blockedDates.filter(d => d !== dt)
        };
      }
      return v;
    }));
    showToast('Calendar date unlocked.');
  };

  // Save Working hours
  const handleSaveHours = () => {
    setVendors(prev => prev.map(v => {
      if (v.id === currentVendor.id) {
        return {
          ...v,
          workingHours: { start: workStart, end: workEnd }
        };
      }
      return v;
    }));
    showToast('Availability hours updated.');
  };

  // Simple mock request list
  const mockRequests = [
    { id: 'r1', client: 'Sarah Connor', date: '2026-08-01', guests: 20, type: 'Taco Bar Station', budget: '$560', status: 'Pending' },
    { id: 'r2', client: 'Bruce Wayne', date: '2026-07-28', guests: 8, type: 'Omakase Tasting', budget: '$960', status: 'Approved' }
  ];

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-30 flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="bg-white text-slate-800 p-4 shrink-0 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <Building className="w-5 h-5 text-[#7A0019]" />
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">Vendor Control Panel</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live: {currentVendor.name}
            </span>
          </div>
        </div>
        
        {/* Simple Switcher */}
        <select 
          value={selectedVendorId} 
          onChange={(e) => {
            const vId = e.target.value;
            setSelectedVendorId(vId);
            const selected = vendors.find(v => v.id === vId);
            if (selected) {
              setDesc(selected.description);
              setRadius(selected.maxRadius);
              setLoc(selected.locationName);
              setPriceRange(selected.pricePerGuest);
              setMinGuests(selected.minGuests);
              setWeekendSurcharge(selected.weekendRatePercentage);
              setWorkStart(selected.workingHours.start);
              setWorkEnd(selected.workingHours.end);
            }
          }}
          className="bg-slate-50 text-slate-800 text-[11px] font-bold p-1 px-2.5 rounded-xl border border-slate-200 focus:outline-none"
        >
          {vendors.map(v => (
            <option key={v.id} value={v.id}>{v.name.split(' ')[0]}</option>
          ))}
        </select>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-white border-b border-slate-250 shrink-0 flex justify-between p-1.5 px-4">
        {[
          { id: 'profile', label: 'Profile' },
          { id: 'pricing', label: 'Pricing' },
          { id: 'menu', label: 'Menu Builder' },
          { id: 'calendar', label: 'Calendar' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-[11px] font-bold py-2 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#7A0019]' + ' text-white shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
        
        {/* TAB 1: Profile Setup */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Business Showcase Profile</h3>
              
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Company / Chef Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Service Base Location</label>
                <input
                  type="text"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] focus:bg-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Maximum Driving Radius</label>
                  <span className="text-xs font-extrabold text-[#7A0019]">{radius} miles</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#7A0019]"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                Save Showcase Profile
              </button>
            </div>

            {/* Simulated Photo Upload Block */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Showcase Photos</h4>
              <div className="grid grid-cols-3 gap-2">
                {currentVendor.imageUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="aspect-video rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-[9px] text-slate-400 font-bold mt-1">Upload</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Pricing Configuration */}
        {activeTab === 'pricing' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">Rates & Surcharge Settings</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Base Price / Guest</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full pl-8 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Minimum Guests</label>
                <input
                  type="number"
                  value={minGuests}
                  onChange={(e) => setMinGuests(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#7A0019] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Weekend Peak Rates</label>
                <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">+{weekendSurcharge}% surcharge</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weekendSurcharge}
                onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[9px] text-slate-400 mt-1">Automatic rates markup applied to Friday, Saturday, and Sunday event dates.</p>
            </div>

            <button
              onClick={handleSavePricing}
              className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Save Pricing Configurations
            </button>
          </div>
        )}

        {/* TAB 3: Menu Builder */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            {/* Add menu item */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight flex items-center justify-between">
                <span>Add Dishes to Menu Showcase</span>
                <span className="bg-[#FFF8E7] text-[#7A0019] px-2 py-0.5 rounded text-[10px] font-bold">{currentVendor.cuisine} menu</span>
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Dish Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lobster Ravioli"
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:ring-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Category</label>
                    <select
                      value={newDishCat}
                      onChange={(e) => setNewDishCat(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
                    >
                      <option value="Appetizers">Appetizers</option>
                      <option value="Mains">Mains</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Individual Price</label>
                    <input
                      type="number"
                      placeholder="18"
                      value={newDishPrice}
                      onChange={(e) => setNewDishPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Dish Image</label>
                      <button
                        type="button"
                        onClick={() => setShowCloudModal(true)}
                        className="text-[10px] font-bold text-[#7A0019] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Cloud className="w-3 h-3 text-[#7A0019]" />
                        <span>Upload to Google Cloud</span>
                      </button>
                    </div>
                    <div className="flex space-x-1.5">
                      <select
                        value={newDishImg}
                        onChange={(e) => setNewDishImg(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none"
                      >
                        <option value="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80">Appetizers (Salad)</option>
                        <option value="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80">Mains (Steak)</option>
                        <option value="https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80">Dessert (Tart)</option>
                        <option value="https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&auto=format&fit=crop&q=80">Beverage (Mocktail)</option>
                        {newDishImg.startsWith('data:') && (
                          <option value={newDishImg}>Google Cloud Uploaded Image</option>
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCloudModal(true)}
                        className="p-2 bg-[#7A0019] text-white rounded-xl hover:bg-[#5E0012] transition-colors cursor-pointer"
                        title="Upload file to Google Cloud"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Item Description</label>
                  <textarea
                    placeholder="Brief ingredients or preparation style..."
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleAddDish}
                  className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Create & Push Menu Item
                </button>
              </div>
            </div>

            {/* Menu List */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800">Current Showcase Items ({currentVendor.menuItems.length})</h4>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto no-scrollbar">
                {currentVendor.menuItems.map((m) => (
                  <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img src={m.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 block truncate">{m.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{m.category} • ${m.price}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteDish(m.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg active:scale-90 transition-transform"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Calendar Availability Manager */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            {/* Working hours Setup */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Working Hours & Operations</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Opening Hour</label>
                  <input
                    type="text"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Closing Hour</label>
                  <input
                    type="text"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveHours}
                className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm"
              >
                Save Working Hours
              </button>
            </div>

            {/* Block dates manager */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Block Specific Dates</h3>
              
              <div className="flex gap-2">
                <input
                  type="date"
                  value={blockedInput}
                  onChange={(e) => setBlockedInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1"
                />
                <button
                  onClick={handleBlockDate}
                  className="bg-[#7A0019] text-white font-bold text-xs px-4 rounded-xl shadow-sm hover:bg-[#5E0012] active:scale-95 transition-transform shrink-0"
                >
                  Block Date
                </button>
              </div>

              {/* Blocked dates tag list */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Blocked Dates</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentVendor.blockedDates.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No dates blocked. Fully open!</span>
                  ) : (
                    currentVendor.blockedDates.map((dt) => (
                      <span 
                        key={dt}
                        className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-red-100"
                      >
                        <span>{dt}</span>
                        <button onClick={() => handleUnblockDate(dt)} className="hover:text-red-800 font-extrabold ml-1">×</button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Active Bookings Requests Simulation */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
              <h3 className="text-xs font-bold text-slate-800 tracking-tight">Reservation Requests Dashboard</h3>
              <div className="space-y-2">
                {mockRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">{req.client}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>{req.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>Date: {req.date} • Guests: {req.guests}</span>
                      <span className="font-semibold text-[#7A0019]">{req.budget}</span>
                    </div>
                    {req.status === 'Pending' && (
                      <div className="flex space-x-1.5 pt-1">
                        <button className="flex-1 bg-emerald-600 text-white py-1 rounded text-[10px] font-bold hover:bg-emerald-700 active:scale-95 transition-transform">Accept</button>
                        <button className="flex-1 bg-slate-200 text-slate-600 py-1 rounded text-[10px] font-bold hover:bg-slate-300 active:scale-95 transition-transform">Decline</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Google Cloud File Upload Modal */}
      <CloudUploadModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        onSelectFileUrl={(url) => {
          setNewDishImg(url);
          showToast('Image attached from Google Cloud!');
        }}
        userRole="Vendor"
        vendorId={currentVendor.id}
      />

      {/* Persistent Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-4 right-4 bg-slate-900 text-white text-xs font-semibold py-3 px-4 rounded-2xl shadow-xl flex items-center justify-center space-x-2 border border-slate-850 z-50 text-center"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-30">
        <button
          onClick={onClose}
          className="w-full bg-[#7A0019] hover:bg-[#5E0012] text-white font-bold py-3 rounded-2xl text-xs active:scale-[0.98] transition-transform"
        >
          Exit Vendor Portal
        </button>
      </div>
    </div>
  );
}
