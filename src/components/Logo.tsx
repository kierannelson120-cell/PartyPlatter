import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showMarketBadge?: boolean;
}

export default function Logo({ size = 'md', onClick, className = '', showMarketBadge = false }: LogoProps) {
  const sizeMap = {
    sm: { text: 'text-lg', popper: 'text-xl', dot: 'w-2 h-2 mt-0.5 ml-0.5' },
    md: { text: 'text-2xl', popper: 'text-2xl', dot: 'w-2.5 h-2.5 mt-1 ml-1' },
    lg: { text: 'text-3xl', popper: 'text-3xl', dot: 'w-3.5 h-3.5 mt-1.5 ml-1.5' }
  }[size];

  return (
    <div 
      onClick={onClick}
      className={`flex items-center select-none cursor-pointer active:scale-98 transition-transform font-['Pacifico',cursive] ${className}`}
    >
      <span className={`${sizeMap.popper} mr-1.5 leading-none shrink-0`}>🎉</span>
      <span className={`${sizeMap.text} text-[#800020] font-normal tracking-tight leading-none drop-shadow-xs`}>
        Party
      </span>
      <span className={`${sizeMap.text} text-[#E0A800] font-normal tracking-tight leading-none ml-1 drop-shadow-xs`}>
        Platter
      </span>
      <span className={`${sizeMap.dot} rounded-full bg-gradient-to-tr from-[#FF7A00] via-[#FFB800] to-[#FFE066] shadow-[0_0_8px_rgba(255,170,0,0.6)] inline-block shrink-0 self-start`} />
      
      {showMarketBadge && (
        <span className="ml-2 px-1.5 py-0.5 text-[9px] font-sans font-extrabold bg-[#800020]/10 text-[#800020] rounded-full uppercase tracking-wider shrink-0">
          Market
        </span>
      )}
    </div>
  );
}
