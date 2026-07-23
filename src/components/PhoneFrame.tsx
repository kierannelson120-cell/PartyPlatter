import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
}

export default function PhoneFrame({ children, onHomePress }: PhoneFrameProps) {
  const [timeStr, setTimeStr] = useState('7:05 PM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-3 md:p-6 select-none relative overflow-hidden font-sans">
      {/* Subtle ambient backglow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Phone Outer Chassis */}
      <div className="relative w-full max-w-[420px] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08)] bg-slate-900/90 backdrop-blur-xl p-2.5 transition-all duration-300">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-4.5 left-1/2 transform -translate-x-1/2 w-28 h-[26px] bg-black rounded-full z-50 flex items-center justify-between px-3.5 shadow-md border border-white/10">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 bg-indigo-500 rounded-full opacity-80"></div>
          </div>
          <div className="w-2 h-2 bg-slate-900 rounded-full border border-slate-800"></div>
        </div>

        {/* Side Hardware Buttons */}
        <div className="absolute left-[-9px] top-28 w-1 h-8 bg-slate-700/80 rounded-l-md"></div>
        <div className="absolute left-[-9px] top-42 w-1 h-12 bg-slate-700/80 rounded-l-md"></div>
        <div className="absolute left-[-9px] top-58 w-1 h-12 bg-slate-700/80 rounded-l-md"></div>
        <div className="absolute right-[-9px] top-40 w-1 h-16 bg-slate-700/80 rounded-r-md"></div>

        {/* Inner Display Screen */}
        <div className="relative w-full h-[820px] rounded-[44px] bg-[#FAFAFC] overflow-hidden flex flex-col border border-slate-200/50 shadow-inner">
          
          {/* iOS Top Status Bar */}
          <div className="h-10 w-full flex items-center justify-between px-6 text-xs font-semibold text-slate-800 z-40 bg-[#FAFAFC]/90 backdrop-blur-md shrink-0">
            {/* Left - Clock */}
            <span className="text-[13px] font-bold tracking-tight text-slate-900 mt-0.5">{timeStr}</span>
            
            {/* Right - Signal, Wifi, Battery */}
            <div className="flex items-center space-x-1.5 text-slate-800">
              <Signal className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />
              <span className="text-[9px] font-extrabold tracking-tight text-slate-800">5G</span>
              <Wifi className="w-3.5 h-3.5 text-slate-800" strokeWidth={2.5} />
              <div className="flex items-center space-x-0.5">
                <Battery className="w-4 h-4 text-slate-800 fill-slate-800" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Core App Viewport */}
          <div className="flex-1 w-full overflow-hidden relative flex flex-col">
            {children}
          </div>

          {/* iOS Bottom Gesture Indicator */}
          <div 
            onClick={onHomePress}
            className="h-[24px] w-full bg-[#FAFAFC]/90 backdrop-blur-md flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 active:scale-95 transition-all z-40"
          >
            <div className="w-[120px] h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Simulator Footer Label */}
      <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-400/80 font-medium tracking-wide uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>PartyPlatter • On-Demand Dining Marketplace</span>
      </div>
    </div>
  );
}

