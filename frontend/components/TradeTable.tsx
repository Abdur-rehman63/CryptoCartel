
import React from 'react';
import { Trade, TradeStatus, TradeType } from '../types';
import { COLORS } from '../constants';

interface TradeTableProps {
  trades: Trade[];
  prices: Record<string, number>;
  isAdmin?: boolean;
  onCloseTrade?: (id: string) => void;
  onDeleteTrade?: (id: string) => void;
}

const TradeTable: React.FC<TradeTableProps> = ({ trades, prices, isAdmin, onCloseTrade, onDeleteTrade }) => {
  const calculatePnL = (trade: Trade) => {
    const currentPrice = trade.status === TradeStatus.CLOSED ? (trade.exitPrice || 0) : (prices[trade.coinId] || trade.entryPrice);
    const diff = currentPrice - trade.entryPrice;

    const pnlValue = diff * trade.quantity;
    const pnlPercent = (diff / trade.entryPrice) * 100;

    return { value: pnlValue, percent: pnlPercent };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-[#848e9c] border-b border-[#2b3139]">
          <tr>
            <th className="pb-4 font-normal">Coin</th>
            <th className="pb-4 font-normal">Side</th>
            <th className="pb-4 font-normal text-center">Qty</th>
            <th className="pb-4 font-normal">Entry</th>
            <th className="pb-4 font-normal">Current/Exit</th>
            <th className="pb-4 font-normal text-right">PnL</th>
            <th className="pb-4 font-normal text-right">Status</th>
            {isAdmin && <th className="pb-4 font-normal text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2b3139]">
          {trades.map(trade => {
            const pnl = calculatePnL(trade);
            const isProfit = pnl.value >= 0;
            const currentPrice = trade.status === TradeStatus.CLOSED ? trade.exitPrice : prices[trade.coinId];
            const isBuy = trade.status === TradeStatus.OPEN;

            return (
              <tr key={trade.id} className="group hover:bg-[#1e2329] transition-colors">
                <td className="py-4">
                  <div className="font-bold text-[#eaecef]">{trade.coinSymbol}</div>
                  <div className="text-xs text-[#848e9c] uppercase">{trade.coinId}</div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isBuy ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {isBuy ? 'BUY' : 'SELL'}
                  </span>
                </td>
                <td className="py-4 text-center font-mono text-xs text-[#fcd535]">
                  {trade.quantity.toFixed(4)}
                </td>
                <td className="py-4">${trade.entryPrice.toLocaleString()}</td>
                <td className="py-4">
                  {currentPrice ? `$${currentPrice.toLocaleString()}` : 'Loading...'}
                </td>
                <td className={`py-4 text-right font-medium ${isProfit ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                  <div>{isProfit ? '+' : ''}{pnl.value.toFixed(2)} USD</div>
                  <div className="text-xs">{isProfit ? '+' : ''}{pnl.percent.toFixed(2)}%</div>
                </td>
                <td className="py-4 text-right">
                  <span className={`text-xs px-2 py-1 rounded ${trade.status === TradeStatus.OPEN ? 'bg-blue-500/10 text-blue-400' : 'bg-[#2b3139] text-[#848e9c]'}`}>
                    {trade.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {trade.status === TradeStatus.OPEN && (
                        <button
                          onClick={() => onCloseTrade?.(trade.id)}
                          className="px-2 py-1 text-xs border border-[#2b3139] hover:bg-[#2b3139] rounded"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteTrade?.(trade.id)}
                        className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {trades.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="py-10 text-center text-[#848e9c]">
                No trades recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTable;
