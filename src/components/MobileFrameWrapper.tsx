import React from 'react';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  onExitMobile: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  onExitMobile,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 py-4 px-2 sm:px-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 font-medium text-slate-300">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span>Android Mobile Viewport Simulation</span>
        </div>
        <button
          onClick={onExitMobile}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-[11px] border border-slate-700 transition"
        >
          Switch to Desktop
        </button>
      </div>

      {/* Android Device Shell */}
      <div className="w-full max-w-sm bg-slate-900 border-4 border-slate-700 rounded-[38px] shadow-2xl overflow-hidden flex flex-col min-h-[780px] max-h-[880px]">
        {/* Status bar */}
        <div className="bg-slate-900 px-6 pt-3 pb-1 flex justify-between items-center text-[10px] text-slate-400 select-none">
          <span className="font-semibold text-white">09:41</span>
          <div className="w-16 h-3 bg-black rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Mobile Viewport Container */}
        <div className="flex-1 overflow-y-auto p-3 bg-slate-950 text-white">
          {children}
        </div>

        {/* Android bottom nav bar handle */}
        <div className="bg-slate-900 py-2 flex justify-center">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
