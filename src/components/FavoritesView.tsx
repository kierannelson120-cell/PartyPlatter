import React, { useState, useEffect } from 'react';
import { Heart, Star, MapPin, ChevronRight, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
import { Vendor } from '../types';

interface FavoritesViewProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  onOpenDirectChat: (vendorId: string, initialMessage?: string) => void;
  onExplore: () => void;
}

export default function FavoritesView({ vendors, onSelectVendor, onOpenDirectChat, onExplore }: FavoritesViewProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem('partyplatter_favs');
    if (savedFavs) {
      try {
        setFavoriteIds(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleRemoveFavorite = (vendorId: string) => {
    const updated = favoriteIds.filter(id => id !== vendorId);
    setFavoriteIds(updated);
    localStorage.setItem('partyplatter_favs', JSON.stringify(updated));
  };

  const favoriteVendors = vendors.filter(v => favoriteIds.includes(v.id));

  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-30 flex flex-col overflow-y-auto no-scrollbar pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-white text-slate-800 p-4 shrink-0 flex items-center justify-between border-b border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <h3 className="text-base font-black text-slate-900">Saved Favorites</h3>
        </div>
        <span className="text-xs text-slate-400 font-bold">{favoriteVendors.length} Saved</span>
      </div>

      <div className="p-4 space-y-4">
        {favoriteVendors.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-sm space-y-3.5 my-8">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">No Favorites Saved Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                Tap the heart icon on any catering service or private chef page to save them here for quick access!
              </p>
            </div>
            <button
              onClick={onExplore}
              className="bg-[#7A0019] hover:bg-[#5E0012] text-white font-bold text-xs py-3 px-6 rounded-2xl transition-all shadow-md active:scale-95 inline-flex items-center space-x-1.5"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {favoriteVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                    <img src={vendor.imageUrls[0]} alt={vendor.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(vendor.id);
                      }}
                      className="absolute top-1 left-1 p-1 bg-white/90 backdrop-blur-md rounded-full shadow text-red-500 hover:scale-110 transition-transform"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-500" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-[#FFF8E7] text-[#7A0019] font-extrabold px-2 py-0.5 rounded uppercase">
                        {vendor.category === 'caterer' ? 'Caterer' : vendor.category === 'food_truck' ? 'Food Truck' : 'Private Chef'}
                      </span>
                      <div className="flex items-center space-x-0.5 text-xs font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{vendor.rating}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate mt-1">{vendor.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{vendor.cuisine} Cuisine • {vendor.locationName}</p>
                    
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-extrabold text-[#7A0019]">${vendor.pricePerGuest} / Guest</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectVendor(vendor)}
                    className="flex-1 bg-[#7A0019] hover:bg-[#5E0012] text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    View Menu & Book
                  </button>
                  <button
                    onClick={() => onOpenDirectChat(vendor.id, `Hi ${vendor.name}! I saved your storefront to my favorites. I'd love to discuss booking details!`)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
