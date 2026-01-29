
import { User, UserRole, Trade, TradeStatus, TradeType } from './types';

export const COLORS = {
  bg: '#0b0e11',
  card: '#1e2329',
  accent: '#fcd535', // Binance Yellow
  text: '#eaecef',
  subtext: '#848e9c',
  success: '#0ecb81',
  danger: '#f6465d',
  border: '#2b3139',
};

export const MOCK_CLIENTS: User[] = [
  { id: '1', email: 'client@test.com', name: 'John Doe', role: UserRole.CLIENT, initialDeposit: 10000 },
  { id: '2', email: 'whale@crypto.com', name: 'Moby Dick', role: UserRole.CLIENT, initialDeposit: 50000 },
];

export const MOCK_ADMIN: User = {
  id: 'admin',
  email: 'admin@cryptocartel.com',
  name: 'Cartel Admin',
  role: UserRole.ADMIN,
  initialDeposit: 0
};

export const INITIAL_TRADES: Trade[] = [
  {
    id: 't1',
    clientId: '1',
    coinId: 'bitcoin',
    coinSymbol: 'BTC',
    entryPrice: 42000,
    quantity: 0.1,
    status: TradeStatus.OPEN,
    type: TradeType.LONG,
    timestamp: Date.now() - 86400000,
  },
  {
    id: 't2',
    clientId: '1',
    coinId: 'ethereum',
    coinSymbol: 'ETH',
    entryPrice: 2200,
    quantity: 2,
    status: TradeStatus.CLOSED,
    type: TradeType.LONG,
    exitPrice: 2500,
    timestamp: Date.now() - 172800000,
    closedAt: Date.now() - 86400000,
  }
];

export const PLANS = [
  {
    name: 'Starter',
    price: '$99/mo',
    features: ['Real-time transparency', 'Basic trade signals', 'Up to 5 open trades'],
  },
  {
    name: 'Pro',
    price: '$249/mo',
    features: ['Priority support', 'Institutional reporting', 'Unlimited trades', 'Risk management AI'],
    popular: true,
  },
  {
    name: 'Custom',
    price: 'Contact Us',
    features: ['Dedicated analyst', 'OTC execution assist', 'Legal & Tax reporting'],
  }
];
