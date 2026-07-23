import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, AlertCircle, RefreshCw } from 'lucide-react';

interface VendorMapProps {
  vendorLocation: string;
  vendorName: string;
  deliveryAddress: string;
  maxRadius: number; // in miles
}

export default function VendorMap({ vendorLocation, vendorName, deliveryAddress, maxRadius }: VendorMapProps) {
  // Let's compute a mock distance based on the length of strings to simulate organic variance
  const computeDistance = () => {
    const combinedLength = (deliveryAddress.length + vendorLocation.length) % 35;
    return combinedLength + 6; // e.g. between 6 and 41 miles
  };

  const distance = computeDistance();
  const isOutOfRange = distance > maxRadius;

  const [etaMinutes, setEtaMinutes] = useState(15);
  const [markerPosition, setMarkerPosition] = useState({ x: 30, y: 70 });

  // Simulate active movement of vendor en-route if they are within range
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isOutOfRange) {
      interval = setInterval(() => {
        setMarkerPosition(prev => {
          // move closer to event coordinates (70, 30)
          const dx = (70 - prev.x) * 0.08;
          const dy = (30 - prev.y) * 0.08;
          
          const newX = prev.x + dx;
          const newY = prev.y + dy;

          // recalculate ETA proportionately
          const remainingDist = Math.sqrt(Math.pow(70 - newX, 2) + Math.pow(30 - newY, 2));
          const updatedEta = Math.max(1, Math.round((remainingDist / 50) * 15));
          setEtaMinutes(updatedEta);

          if (remainingDist < 2) {
            clearInterval(interval);
            return { x: 70, y: 30 };
          }
          return { x: newX, y: newY };
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isOutOfRange]);

  const handleResetSimulation = () => {
    setMarkerPosition({ x: 30, y: 70 });
    setEtaMinutes(15);
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/60 shadow-sm space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-black text-[#7A0019] uppercase tracking-wider block">Live Delivery Logistics</span>
          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">Route Distance Verification</h4>
        </div>
        <button
          onClick={handleResetSimulation}
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200"
          title="Reset movement simulation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-44 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px] opacity-40"></div>

        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Service Area Boundary circle (dotted radius) centered at Vendor Starting Coordinates (30, 70) */}
          <circle 
            cx="30" 
            cy="70" 
            r={maxRadius * 1.1} 
            fill="none" 
            stroke={isOutOfRange ? "#ef4444" : "#FFC72C"} 
            strokeWidth="1.2" 
            strokeDasharray="3 3"
            className="opacity-30" 
          />
          <circle 
            cx="30" 
            cy="70" 
            r={maxRadius * 1.1} 
            fill={isOutOfRange ? "#fee2e2" : "#FFF8E7"} 
            className="opacity-15"
          />

          {/* Planned Delivery Path line */}
          <path 
            d="M 30 70 Q 50 45, 70 30" 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />

          {/* active completed route path */}
          {!isOutOfRange && (
            <path 
              d={`M 30 70 Q 50 45, ${markerPosition.x} ${markerPosition.y}`} 
              fill="none" 
              stroke="#7A0019" 
              strokeWidth="2" 
              className="opacity-80"
            />
          )}

          {/* Vendor Location Base (Start Point) */}
          <circle cx="30" cy="70" r="3.5" fill="#1e293b" />
          <text x="32" y="74" fill="#475569" className="text-[6px] font-bold select-none">Start</text>

          {/* Event Delivery Address (Target Point) */}
          <circle cx="70" cy="30" r="4" fill="#7A0019" />
          <text x="73" y="33" fill="#1e293b" className="text-[6px] font-black select-none">Event</text>
        </svg>

        {/* Live moving vehicle marker */}
        {!isOutOfRange && (
          <motion.div
            style={{ left: `${markerPosition.x}%`, top: `${markerPosition.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-[#7A0019] rounded-full border-2 border-white shadow flex items-center justify-center text-white"
          >
            <Navigation className="w-3.5 h-3.5 rotate-45 animate-pulse" />
          </motion.div>
        )}

        {/* Radar boundary indicators */}
        <div className="absolute top-2 left-2 bg-slate-900/80 text-white font-mono text-[8px] p-1 px-1.5 rounded flex items-center space-x-1">
          <Compass className="w-3 h-3 text-[#FFC72C] animate-spin" />
          <span>RADAR GPS CALIBRATED</span>
        </div>
      </div>

      {/* Distance Matrix Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Travel Radius Limit</span>
          <div className="flex items-center space-x-1">
            <span className="font-extrabold text-slate-800">{maxRadius} miles</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Calculated Distance</span>
          <div className="flex items-center space-x-1">
            <span className={`font-extrabold ${isOutOfRange ? 'text-red-500' : 'text-slate-800'}`}>{distance} miles</span>
          </div>
        </div>
      </div>

      {/* Warnings & En route Status */}
      {isOutOfRange ? (
        <div className="bg-red-50 p-3 rounded-2xl border border-red-100 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-red-800">Outside Delivery Boundary</span>
            <p className="text-[10px] text-red-600 mt-0.5">
              Warning: Event address is {distance - maxRadius} miles outside of {vendorName}'s service limit. Additional fuel/toll travel surcharges may be applied by the chef.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#FFF8E7] p-3 rounded-2xl border border-[#FFC72C]/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-[#7A0019]">Chef En Route Countdown</span>
          </div>
          <span className="text-xs font-extrabold text-[#7A0019] bg-white border border-[#FFC72C]/40 px-2 py-0.5 rounded-lg">
            ETA {etaMinutes} mins
          </span>
        </div>
      )}
    </div>
  );
}
