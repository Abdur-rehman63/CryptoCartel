import React from 'react';
import { User, Trade, PortfolioSummary, TradeStatus } from '../types';
import PortfolioStats from './PortfolioStats';
import TradeTable from './TradeTable';

const ClientDashboard: React.FC<{ user: User, trades: Trade[], summary: PortfolioSummary, prices: Record<string, number> }> = ({ user, trades, summary, prices }) => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Portfolio Overview</h2>
            <button className="bg-[#fcd535] text-black px-4 py-2 rounded-md font-bold text-xs hover:opacity-90 transition-all">
                GET INSIGHTS
            </button>
        </div>

        <PortfolioStats summary={summary} />

        <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white uppercase text-sm">Portfolio History</h3>
                <div className="flex gap-2 text-[10px] font-bold">
                    <span className="px-2 py-1 bg-[#2b3139] rounded cursor-pointer text-[#fcd535]">1W</span>
                    <span className="px-2 py-1 hover:bg-[#2b3139] rounded cursor-pointer text-[#848e9c]">1M</span>
                    <span className="px-2 py-1 hover:bg-[#2b3139] rounded cursor-pointer text-[#848e9c]">ALL</span>
                </div>
            </div>
            <div className="h-48 relative w-full overflow-hidden flex items-end">
                <svg viewBox="0 0 1000 100" className="w-full h-full text-[#fcd535]">
                    <path d="M0,80 Q100,75 200,85 T400,60 T600,65 T800,45 T1000,30 L1000,100 L0,100 Z" fill="rgba(252, 213, 53, 0.1)" />
                    <path d="M0,80 Q100,75 200,85 T400,60 T600,65 T800,45 T1000,30" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#1e2329] rounded-xl border border-[#2b3139] p-6">
                <h3 className="font-bold mb-4 uppercase text-sm">Active Trades</h3>
                <TradeTable trades={trades.filter(t => t.status === TradeStatus.OPEN)} prices={prices} />
            </div>

            <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] p-6">
                <h3 className="font-bold mb-4 uppercase text-sm">Top Assets</h3>
                <div className="space-y-4">
                    {trades.slice(0, 3).map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold">{t.coinSymbol}</p>
                                <p className="text-[10px] text-[#848e9c] uppercase">{t.coinId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">${(prices[t.coinId] || t.entryPrice).toLocaleString()}</p>
                                <p className="text-xs text-[#0ecb81]">+{(Math.random() * 5).toFixed(2)}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ClientDashboard;
