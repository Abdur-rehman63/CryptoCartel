
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export enum TradeStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export enum TradeType {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  initialDeposit: number;
}

export interface Trade {
  id: string;
  clientId: string;
  coinId: string;
  coinSymbol: string;
  entryPrice: number;
  currentPrice?: number;
  exitPrice?: number;
  quantity: number;
  takeProfit?: number;
  stopLoss?: number;
  status: TradeStatus;
  type: TradeType;
  notes?: string;
  timestamp: number;
  closedAt?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  timestamp: number;
}

export interface Reply {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
}

export interface PortfolioSummary {
  currentBalance: number;
  totalInvested: number;
  totalPnL: number;
  roi: number;
  winRate: number;
  openTradesCount: number;
}
