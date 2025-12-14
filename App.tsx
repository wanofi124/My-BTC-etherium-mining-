import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Zap, Server, Activity, ArrowUpRight, Shield, Cpu, Layers, DollarSign, Terminal, Loader2 } from 'lucide-react';
import { CircuitBoard } from './components/MiningVisuals';
import Button from './components/Button';
import WithdrawModal from './components/WithdrawModal';
import { getMarketAnalysis } from './services/geminiService';
import { CryptoType, WalletState, MarketData } from './types';
import { 
  BASE_BTC_RATE_PER_SECOND, 
  BASE_ETH_RATE_PER_SECOND, 
  MAX_HASH_RATE, 
  REFRESH_RATE_MS 
} from './constants';

const App: React.FC = () => {
  // State
  const [wallet, setWallet] = useState<WalletState>({ btc: 12.4502, eth: 145.203 });
  const [hashRate, setHashRate] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<{time: string, rate: number}[]>([]);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<CryptoType>(CryptoType.BTC);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  
  // Refs for animation
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    // Initial dummy logs
    addLog("System initialized. Quantum cores: ONLINE");
    addLog("Connecting to mainnet nodes...");
    addLog("Secure channel established via TLS 1.3");
  }, []);

  // Helpers
  const addLog = (msg: string) => {
    setLogMessages(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const toggleMining = () => {
    setIsMining(prev => !prev);
    if (!isMining) {
      addLog("Mining sequence started. Ramping up hashrate...");
    } else {
      addLog("Mining sequence halted. Cooling down systems.");
      setHashRate(0);
    }
  };

  // Mining Loop
  const mine = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastUpdateRef.current) / 1000; // seconds
    lastUpdateRef.current = now;

    if (isMining) {
      // Ramp up hash rate
      setHashRate(prev => Math.min(prev + (Math.random() * 5000), MAX_HASH_RATE));

      // Calculate earnings based on hashrate percentage
      const efficiency = hashRate / MAX_HASH_RATE;
      
      setWallet(prev => ({
        btc: prev.btc + (BASE_BTC_RATE_PER_SECOND * efficiency * delta),
        eth: prev.eth + (BASE_ETH_RATE_PER_SECOND * efficiency * delta)
      }));

      // Update Chart Data
      if (Math.random() > 0.8) {
        setChartData(prev => {
          const newData = [...prev, { time: new Date().toLocaleTimeString(), rate: hashRate }];
          return newData.slice(-20); // Keep last 20 points
        });
      }
    } else {
      setHashRate(prev => Math.max(prev - 20000, 0));
    }

    animationRef.current = requestAnimationFrame(mine);
  }, [isMining, hashRate]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(mine);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mine]);

  // AI Insights Effect
  useEffect(() => {
    if (isMining && hashRate > MAX_HASH_RATE * 0.5 && !marketData) {
      // Fetch insights once we are at good speed
      getMarketAnalysis(Math.floor(hashRate / 1000)).then(data => {
        setMarketData(data);
        addLog(`AI Insight Received: ${data.advice}`);
      });
    }
  }, [isMining, hashRate, marketData]);

  // Handle Withdraw
  const handleWithdrawClick = (currency: CryptoType) => {
    setActiveCurrency(currency);
    setWithdrawModalOpen(true);
  };

  const executeWithdraw = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      [activeCurrency === CryptoType.BTC ? 'btc' : 'eth']: 
        prev[activeCurrency === CryptoType.BTC ? 'btc' : 'eth'] - amount
    }));
    addLog(`WITHDRAWAL CONFIRMED: ${amount} ${activeCurrency}`);
    setWithdrawModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black pb-20 overflow-x-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-cyan-900/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-2xl font-display font-bold tracking-widest text-white">
                HYPER<span className="text-cyan-400">MINE</span><span className="text-xs align-top ml-1 text-yellow-400">PRO</span>
              </h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono text-cyan-600">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></span>
              NETWORK: {isMining ? 'ACTIVE' : 'IDLE'}
            </div>
            <div>LATENCY: 12ms</div>
            <div>NODES: 8,492</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-28 space-y-8 relative z-10">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* BTC Card */}
          <div className="relative group bg-slate-900/50 border border-yellow-500/20 p-6 rounded-xl backdrop-blur-sm transition-all hover:border-yellow-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-slate-400 font-mono text-sm uppercase">Bitcoin Balance</h3>
                <div className="text-4xl font-display font-bold text-yellow-400 mt-2 tracking-wider tabular-nums neon-text-gold">
                  {wallet.btc.toFixed(6)} <span className="text-sm">BTC</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
                <span className="font-bold text-yellow-500">₿</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="gold" 
                className="w-full text-sm py-2" 
                onClick={() => handleWithdrawClick(CryptoType.BTC)}
              >
                Withdraw BTC
              </Button>
            </div>
          </div>

          {/* ETH Card */}
          <div className="relative group bg-slate-900/50 border border-purple-500/20 p-6 rounded-xl backdrop-blur-sm transition-all hover:border-purple-500/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-slate-400 font-mono text-sm uppercase">Ethereum Balance</h3>
                <div className="text-4xl font-display font-bold text-indigo-400 mt-2 tracking-wider tabular-nums" style={{ textShadow: "0 0 10px rgba(129,140,248,0.5)" }}>
                  {wallet.eth.toFixed(6)} <span className="text-sm">ETH</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
                <span className="font-bold text-indigo-500">Ξ</span>
              </div>
            </div>
             <div className="flex gap-2">
              <Button 
                variant="primary" // Reusing primary as blue/purpleish
                className="w-full text-sm py-2 !border-indigo-400 !text-indigo-400 hover:!bg-indigo-400 hover:!text-white"
                onClick={() => handleWithdrawClick(CryptoType.ETH)}
              >
                Withdraw ETH
              </Button>
            </div>
          </div>

          {/* Hashrate Card */}
          <div className="relative bg-black border border-cyan-800 p-6 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
             <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-cyan-600 font-mono text-sm uppercase">Total Hash Power</h3>
                <div className="text-4xl font-display font-bold text-white mt-2 tracking-wider tabular-nums">
                  {(hashRate / 1000).toFixed(1)} <span className="text-sm text-cyan-400">PH/s</span>
                </div>
              </div>
              <Activity className={`w-10 h-10 text-cyan-400 ${isMining ? 'animate-pulse' : 'opacity-20'}`} />
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300" 
                style={{ width: `${(hashRate / MAX_HASH_RATE) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-mono text-cyan-600 mt-2">
              <span>EFFICIENCY: {((hashRate / MAX_HASH_RATE) * 100).toFixed(1)}%</span>
              <span>TEMP: {isMining ? (65 + Math.random() * 5).toFixed(1) : 30}°C</span>
            </div>
          </div>

        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Visualizer Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 h-80 relative overflow-hidden">
              <h3 className="absolute top-6 left-6 font-display text-xs text-slate-500 uppercase tracking-widest z-10 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Real-time Difficulty
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, MAX_HASH_RATE]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#06b6d4' }} 
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CircuitBoard active={isMining} />
              
              <div className="bg-black border border-cyan-900/50 rounded-lg p-6 flex flex-col justify-between">
                <div>
                   <h3 className="font-display text-cyan-400 mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5" /> AI SYSTEM LOG
                  </h3>
                  <div className="font-mono text-xs space-y-2 h-32 overflow-hidden relative" ref={logContainerRef}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
                    {logMessages.map((log, i) => (
                      <div key={i} className="text-emerald-500/80 truncate">
                        <span className="text-slate-600 mr-2">{'>'}</span>{log}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-cyan-900/30">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-xs text-slate-500 uppercase tracking-wider">Master Control</span>
                     {isMining && <span className="text-xs text-green-500 animate-pulse">● LIVE</span>}
                  </div>
                  <Button 
                    onClick={toggleMining} 
                    variant={isMining ? 'danger' : 'primary'}
                    className="w-full py-4 text-lg"
                  >
                    {isMining ? 'TERMINATE SEQUENCE' : 'INITIATE MINING PROTOCOL'}
                  </Button>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / AI Analysis */}
          <div className="space-y-6">
            
            {/* Market Analysis */}
            <div className="bg-gradient-to-b from-slate-900 to-black border border-cyan-500/20 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Cpu className="w-24 h-24 text-cyan-500" />
               </div>
               
               <h3 className="font-display text-lg text-white mb-6 flex items-center gap-2">
                 <Terminal className="w-5 h-5 text-cyan-400" />
                 GEMINI AI INSIGHTS
               </h3>

               {marketData ? (
                 <div className="space-y-6 animate-in fade-in duration-700">
                    <div className="flex items-center gap-4">
                      <div className={`text-sm font-bold px-3 py-1 rounded border ${marketData.trend === 'bullish' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                        {marketData.trend.toUpperCase()} TREND
                      </div>
                      <div className="text-xs text-slate-400">
                        VOLATILITY: <span className="text-white">{marketData.volatilityIndex}/100</span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-mono text-cyan-100 leading-relaxed border-l-2 border-cyan-500 pl-4">
                      "{marketData.advice}"
                    </p>

                    <div className="text-[10px] text-slate-500 font-mono mt-4">
                      Updated via Quantum Uplink • Gemini 2.5 Flash
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-10 text-slate-600 gap-2">
                   <Loader2 className="animate-spin w-8 h-8" />
                   <span className="text-xs font-mono uppercase">Analyzing Blockchain...</span>
                 </div>
               )}
            </div>

            {/* Profit Projection */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <h3 className="text-slate-400 text-xs font-mono uppercase mb-4">Projected Hourly Yield</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-display font-bold text-white">~100.00</span>
                <span className="text-xl text-yellow-500 font-bold mb-1">BTC</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-yellow-500 w-full animate-pulse"></div>
              </div>
              
              <div className="flex gap-2 items-center text-xs text-green-400 bg-green-900/20 p-2 rounded border border-green-900/50">
                <ArrowUpRight className="w-4 h-4" />
                <span>+420% Efficiency with Quantum Boost</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-4 p-4 border border-cyan-900/30 rounded-lg bg-cyan-950/10">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="text-sm font-bold text-white">SECURE ENCLAVE</div>
                <div className="text-xs text-cyan-600">AES-256 ENCRYPTION ACTIVE</div>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center py-8 text-slate-600 text-xs font-mono">
          <p>HYPERMINE X SIMULATOR v4.2.0 • FOR EDUCATIONAL & DEMONSTRATION PURPOSES ONLY</p>
          <p className="mt-1 opacity-50">Not connected to actual mainnet. Balances are simulated.</p>
        </div>

      </main>

      <WithdrawModal 
        isOpen={withdrawModalOpen} 
        onClose={() => setWithdrawModalOpen(false)}
        currency={activeCurrency}
        balance={activeCurrency === CryptoType.BTC ? wallet.btc : wallet.eth}
        onConfirm={executeWithdraw}
      />
    </div>
  );
};

export default App;