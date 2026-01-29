import React, { useState } from 'react';
import { Trade, TradeStatus } from '../types';
import TradeTable from './TradeTable';

const CoinsView: React.FC<{ trades: Trade[], prices: Record<string, number> }> = ({ trades, prices }) => {
    const [filter, setFilter] = useState<TradeStatus | 'ALL'>('ALL');
    const filtered = filter === 'ALL' ? trades : trades.filter(t => t.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold uppercase tracking-wider">My Coins</h2>
                <div className="flex bg-[#1e2329] p-1 rounded-md border border-[#2b3139]">
                    <button onClick={() => setFilter('ALL')} className={`px-4 py-1 text-xs rounded ${filter === 'ALL' ? 'bg-[#2b3139] text-[#fcd535]' : 'text-[#848e9c]'}`}>All</button>
                    <button onClick={() => setFilter(TradeStatus.OPEN)} className={`px-4 py-1 text-xs rounded ${filter === TradeStatus.OPEN ? 'bg-[#2b3139] text-[#fcd535]' : 'text-[#848e9c]'}`}>Open</button>
                    <button onClick={() => setFilter(TradeStatus.CLOSED)} className={`px-4 py-1 text-xs rounded ${filter === TradeStatus.CLOSED ? 'bg-[#2b3139] text-[#fcd535]' : 'text-[#848e9c]'}`}>Closed</button>
                </div>
            </div>
            <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] p-6">
                <TradeTable trades={filtered} prices={prices} />
            </div>
        </div>
    );
};

export default CoinsView;
