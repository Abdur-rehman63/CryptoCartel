import React from 'react';
import { User } from '../types';

const ReportsView: React.FC<{ user: User }> = ({ user }) => {
    const months = ['JANUARY 2024', 'FEBRUARY 2024', 'MARCH 2024'];
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Monthly Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {months.map(month => (
                    <div key={month} className="bg-[#1e2329] border border-[#2b3139] p-6 rounded-xl hover:border-[#fcd535] transition-all group cursor-pointer">
                        <h4 className="font-bold mb-4">{month}</h4>
                        <button className="w-full py-2 bg-[#2b3139] group-hover:bg-[#fcd535] group-hover:text-black rounded text-xs font-bold transition-all uppercase">
                            Download PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportsView;
