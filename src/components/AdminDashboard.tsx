import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle, XCircle, Clock, Search, Building, Star, AlertCircle, RefreshCw } from 'lucide-react';
import { Vendor } from '../types';

interface AdminDashboardProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  onClose: () => void;
}

export default function AdminDashboard({ vendors, setVendors, onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const handleUpdateStatus = (vendorId: string, newStatus: 'approved' | 'rejected' | 'pending_review') => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return { ...v, status: newStatus };
      }
      return v;
    }));
  };

  const pendingCount = vendors.filter(v => v.status === 'pending_review').length;
  const approvedCount = vendors.filter(v => v.status === 'approved' || !v.status).length;
  const rejectedCount = vendors.filter(v => v.status === 'rejected').length;

  const filteredVendors = vendors.filter(v => {
    const status = v.status || 'approved';
    if (activeTab === 'pending' && status !== 'pending_review') return false;
    if (activeTab === 'approved' && status !== 'approved') return false;
    if (activeTab === 'rejected' && status !== 'rejected') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-40 flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 shrink-0 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7A0019] to-[#FFC72C] flex items-center justify-center text-white shadow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              <span>Master Admin Control Panel</span>
              <span className="bg-[#7A0019] text-[#FFC72C] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                System Master
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Manage vendor approvals, platform compliance & reviews</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all"
        >
          Exit Admin
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="bg-white border-b border-slate-200/80 p-3 px-4 shrink-0 grid grid-cols-3 gap-2">
        <div className="bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-2xl flex items-center space-x-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider block">Pending Review</span>
            <span className="text-sm font-black text-amber-950">{pendingCount} Vendors</span>
          </div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200/60 p-2.5 rounded-2xl flex items-center space-x-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider block">Live Approved</span>
            <span className="text-sm font-black text-emerald-950">{approvedCount} Vendors</span>
          </div>
        </div>

        <div className="bg-red-50/80 border border-red-200/60 p-2.5 rounded-2xl flex items-center space-x-2.5">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <span className="text-[9px] font-extrabold text-red-800 uppercase tracking-wider block">Rejected/Blocked</span>
            <span className="text-sm font-black text-red-950">{rejectedCount} Vendors</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border-b border-slate-200/80 p-3 px-4 shrink-0 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor application by name, cuisine, bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1.5 focus:ring-[#7A0019]"
          />
        </div>

        <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'approved', label: `Approved (${approvedCount})` },
            { id: 'rejected', label: `Rejected (${rejectedCount})` },
            { id: 'all', label: `All Vendors (${vendors.length})` }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 text-[10px] font-black py-1.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#7A0019] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vendor Applications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar pb-24">
        {filteredVendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/60 shadow-sm space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No Vendors Found</h4>
            <p className="text-[10px] text-slate-400">There are no vendor listings matching this status category or search query.</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const vStatus = vendor.status || 'approved';
            return (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden"
              >
                {/* Status Indicator Stripe */}
                <div className={`absolute top-0 inset-x-0 h-1 ${
                  vStatus === 'pending_review' ? 'bg-amber-400' : vStatus === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />

                {/* Vendor Header info */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img src={vendor.imageUrls[0]} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-extrabold text-slate-900 truncate">{vendor.name}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                          vStatus === 'pending_review' ? 'bg-amber-100 text-amber-800' : vStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {vStatus === 'pending_review' ? '⏳ Pending Approval' : vStatus === 'approved' ? '✓ Approved & Live' : '✕ Rejected'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        {vendor.category === 'caterer' ? '🍽️ Catering Co.' : vendor.category === 'food_truck' ? '🚚 Food Truck' : '👨‍🍳 Private Chef'} • {vendor.cuisine} Cuisine
                      </p>
                      <p className="text-[10px] text-[#7A0019] font-bold mt-0.5">
                        ${vendor.pricePerGuest} / Guest Rate • Min Guests: {vendor.minGuests}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {vendor.description}
                </p>

                {/* Metadata tags */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
                  <span>Radius: {vendor.maxRadius} miles</span>
                  <span>Location: {vendor.locationName}</span>
                  <span>Hours: {vendor.workingHours.start} - {vendor.workingHours.end}</span>
                </div>

                {/* Admin Approval Control Buttons */}
                <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                  {vStatus !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(vendor.id, 'approved')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Listing</span>
                    </button>
                  )}

                  {vStatus !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(vendor.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Application</span>
                    </button>
                  )}

                  {vStatus !== 'pending_review' && (
                    <button
                      onClick={() => handleUpdateStatus(vendor.id, 'pending_review')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] py-2 px-3 rounded-xl transition-all active:scale-95 flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset to Pending</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
