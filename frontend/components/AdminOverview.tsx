import React, { useState } from 'react';
import { User, Trade, TradeType } from '../types';
import { searchCoins } from '../services/cryptoService';
import TradeTable from './TradeTable';

const AdminOverview: React.FC<{ trades: Trade[], prices: Record<string, number>, clients: User[], onAddTrade: (t: any) => void, onCloseTrade: (id: string) => void, onDeleteTrade: (id: string) => void }> = ({ trades, prices, clients, onAddTrade, onCloseTrade, onDeleteTrade }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [foundCoins, setFoundCoins] = useState<any[]>([]);
    const [selectedCoin, setSelectedCoin] = useState<any>(null);
    const [newTrade, setNewTrade] = useState({ clientId: '', entryPrice: '', quantity: '', type: TradeType.LONG, investedAmount: '' });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold uppercase tracking-wider">Admin Control</h2>
                <button onClick={() => setShowAddModal(true)} className="bg-[#fcd535] text-black px-4 py-2 rounded font-bold text-xs uppercase">+ New Position</button>
            </div>
            <div className="bg-[#1e2329] p-6 rounded-xl border border-[#2b3139]">
                <h3 className="font-bold mb-4 uppercase text-sm">Global Portfolio</h3>
                <TradeTable trades={trades} prices={prices} isAdmin onCloseTrade={onCloseTrade} onDeleteTrade={onDeleteTrade} />
            </div>
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1e2329] w-full max-w-lg p-8 rounded-xl border border-[#2b3139]">
                        <h3 className="text-lg font-bold mb-6 uppercase">Open New Position</h3>
                        <div className="space-y-4">
                            <select className="w-full bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs" value={newTrade.clientId} onChange={e => setNewTrade({ ...newTrade, clientId: e.target.value })}>
                                <option value="">Select Target Client...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <input className="flex-1 bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs" placeholder="Search Symbol..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                <button onClick={async () => setFoundCoins(await searchCoins(searchQuery))} className="bg-[#2b3139] px-3 rounded text-xs uppercase font-bold">Search</button>
                            </div>
                            {foundCoins.length > 0 && <div className="max-h-32 overflow-y-auto bg-[#0b0e11] p-2 rounded">{foundCoins.map(c => <button key={c.id} onClick={() => { setSelectedCoin(c); setFoundCoins([]); setSearchQuery(c.name); }} className="block w-full text-left p-2 text-[10px] hover:bg-[#2b3139] uppercase">{c.name}</button>)}</div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-[#848e9c] uppercase font-bold">Entry Price ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs text-white"
                                        value={newTrade.entryPrice}
                                        onChange={e => {
                                            const entryPrice = e.target.value;
                                            const quantity = (Number(newTrade.investedAmount) / Number(entryPrice)) || 0;
                                            setNewTrade({ ...newTrade, entryPrice, quantity: quantity > 0 ? quantity.toString() : '' });
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-[#848e9c] uppercase font-bold">Invested Amount ($)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs text-white"
                                        value={newTrade.investedAmount || ''}
                                        onChange={e => {
                                            const invested = e.target.value;
                                            const quantity = (Number(invested) / Number(newTrade.entryPrice)) || 0;
                                            setNewTrade({ ...newTrade, investedAmount: invested, quantity: quantity > 0 ? quantity.toString() : '' });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Read-only Quantity Display */}
                            <div className="bg-[#0b0e11] p-3 rounded border border-[#2b3139] flex justify-between items-center">
                                <span className="text-[10px] text-[#848e9c] uppercase font-bold">Calculated Quantity:</span>
                                <span className="text-sm font-mono text-[#fcd535]">
                                    {Number(newTrade.quantity) > 0 ? Number(newTrade.quantity).toFixed(6) : '0.000000'} {selectedCoin?.symbol?.toUpperCase()}
                                </span>
                            </div>

                            <button onClick={() => { if (selectedCoin && newTrade.clientId && newTrade.entryPrice && newTrade.quantity) { onAddTrade({ ...newTrade, entryPrice: Number(newTrade.entryPrice), quantity: Number(newTrade.quantity), coinId: selectedCoin.id, coinSymbol: selectedCoin.symbol, type: TradeType.LONG }); setShowAddModal(false); setNewTrade({ clientId: '', entryPrice: '', quantity: '', type: TradeType.LONG, investedAmount: '' }); } }} className="w-full bg-[#fcd535] text-black py-3 rounded font-bold text-xs uppercase hover:bg-[#e5c230] transition-colors">Confirm Buy Order</button>
                            <button onClick={() => setShowAddModal(false)} className="w-full text-[10px] text-[#848e9c] uppercase hover:text-white transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOverview;
