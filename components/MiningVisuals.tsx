import React from 'react';

export const CircuitBoard: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg bg-black border border-cyan-900/50">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      
      {/* Central Core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`w-32 h-32 rounded-full border-4 border-cyan-500/30 flex items-center justify-center ${active ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
          <div className={`w-24 h-24 rounded-full border-2 border-cyan-400/50 ${active ? 'animate-[spin_3s_linear_infinite_reverse]' : ''}`}></div>
        </div>
        <div className={`absolute top-0 left-0 w-32 h-32 rounded-full bg-cyan-500 blur-xl opacity-20 ${active ? 'animate-pulse' : ''}`}></div>
      </div>

      {/* Data Streams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        
        {active && Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M ${50 + Math.random() * 400} ${Math.random() * 300} L ${200 + Math.random() * 200} ${150}`}
            stroke="url(#grad1)"
            strokeWidth="2"
            fill="transparent"
            className="opacity-0 animate-[dash_1s_linear_infinite]"
            style={{ animationDelay: `${Math.random()}s` }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes dash {
          0% { stroke-dasharray: 10, 100; stroke-dashoffset: 100; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dasharray: 10, 100; stroke-dashoffset: -100; opacity: 0; }
        }
      `}</style>
      
      <div className="absolute bottom-4 right-4 text-xs text-cyan-700 font-mono">
        SYSTEM_STATUS: {active ? <span className="text-green-400">OPTIMIZED</span> : <span className="text-red-500">STANDBY</span>}
      </div>
    </div>
  );
};