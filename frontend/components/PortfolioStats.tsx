
import React from 'react';
import { PortfolioSummary } from '../types';
import { COLORS } from '../constants';

interface PortfolioStatsProps {
  summary: PortfolioSummary;
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ summary }) => {
  const isPositive = summary.totalPnL >= 0;

  const stats = [
    { label: 'Current Balance', value: `$${summary.currentBalance.toLocaleString()}`, sub: 'USD' },
    { label: 'Total Invested', value: `$${summary.totalInvested.toLocaleString()}`, sub: 'Principal' },
    { 
      label: 'Total PnL', 
      value: `${isPositive ? '+' : ''}$${summary.totalPnL.toFixed(2)}`, 
      sub: `${isPositive ? '+' : ''}${summary.roi.toFixed(2)}%`,
      highlight: true,
      positive: isPositive
    },
    { label: 'Win Rate', value: `${summary.winRate.toFixed(1)}%`, sub: 'Closed Trades' },
    { label: 'Open Positions', value: summary.openTradesCount.toString(), sub: 'Active' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#1e2329] p-4 rounded-lg border border-[#2b3139]">
          <p className="text-xs text-[#848e9c] mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-xl font-bold ${stat.highlight ? (stat.positive ? 'text-[#0ecb81]' : 'text-[#f6465d]') : 'text-[#eaecef]'}`}>
              {stat.value}
            </h3>
            <span className={`text-[10px] uppercase font-bold ${stat.highlight ? (stat.positive ? 'text-[#0ecb81]' : 'text-[#f6465d]') : 'text-[#848e9c]'}`}>
              {stat.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioStats;
