import React, { useState, useEffect } from 'react';
import Button from './Button';
import { CryptoType } from '../types';
import { CheckCircle, AlertTriangle, Loader2, Wallet } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CryptoType;
  balance: number;
  onConfirm: (amount: number) => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, currency, balance, onConfirm }) => {
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setAddress('');
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || val > balance) return;
    
    setStep('processing');
    
    // Simulate network delay
    setTimeout(() => {
      setStep('success');
      onConfirm(val);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
           style={{ clipPath: "polygon(5% 0, 100% 0, 100% 95%, 95% 100%, 0 100%, 0 5%)" }}>
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-cyan-400" />
          SECURE WITHDRAWAL
        </h2>

        {step === 'input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-cyan-600 mb-1 uppercase tracking-wider">Target Wallet Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={`Enter ${currency} Address`}
                className="w-full bg-black/50 border border-cyan-900 text-cyan-100 p-3 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-cyan-600 mb-1 uppercase tracking-wider">Amount</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-black/50 border border-cyan-900 text-white p-3 focus:border-cyan-400 focus:outline-none font-mono text-xl"
                />
                <span className="text-cyan-400 font-bold">{currency}</span>
              </div>
              <p className="text-right text-xs text-slate-400 mt-1">Available: {balance.toFixed(4)} {currency}</p>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={onClose} className="flex-1 py-3 text-slate-400 hover:text-white transition-colors uppercase font-bold text-sm">Cancel</button>
              <Button 
                onClick={handleWithdraw} 
                className="flex-1"
                disabled={!address || !amount || parseFloat(amount) > balance}
              >
                Transfer
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-cyan-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto text-cyan-400 w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-display text-cyan-400 mb-2">VERIFYING BLOCKS</h3>
            <p className="text-slate-400 text-sm animate-pulse">Hashing transaction to the ledger...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-display text-white mb-2">TRANSFER COMPLETE</h3>
            <p className="text-slate-400 text-sm mb-8">Funds have been dispatched to your wallet.</p>
            <Button onClick={onClose} variant="primary" className="w-full">
              Close Receipt
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-dashed border-slate-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-tight">
            Transactions are irreversible. Ensure the receiving address supports {currency} network withdrawals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;