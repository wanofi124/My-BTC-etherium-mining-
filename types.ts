export enum CryptoType {
  BTC = 'BTC',
  ETH = 'ETH'
}

export interface WalletState {
  btc: number;
  eth: number;
}

export interface MiningStats {
  hashRate: number; // in TH/s
  activeWorkers: number;
  powerConsumption: number; // in Watts
  networkDifficulty: string;
  temperature: number;
}

export interface MarketData {
  trend: 'bullish' | 'bearish' | 'neutral';
  advice: string;
  volatilityIndex: number;
}

export interface Transaction {
  id: string;
  type: 'mined' | 'withdraw';
  amount: number;
  currency: CryptoType;
  timestamp: Date;
  status: 'completed' | 'pending';
}