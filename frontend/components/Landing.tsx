import React from 'react';
import { PLANS } from '../constants';

const Landing: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => (
    <div className="flex flex-col relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 z-0 opacity-20">
            <div className="absolute inset-0" style={{
                backgroundImage: 'url(/images/crypto-pattern.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: 'float 20s ease-in-out infinite'
            }}></div>
        </div>

        {/* Navigation */}
        <nav className="p-6 flex justify-between items-center container mx-auto relative z-10 backdrop-blur-sm bg-[#0b0e11]/80">
            <h1 className="text-2xl font-black text-[#fcd535] tracking-tight">CRYPTO CARTEL</h1>
            <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#848e9c]">
                <a href="#intro" className="hover:text-[#fcd535] transition-colors duration-300">Introduction</a>
                <a href="#about" className="hover:text-[#fcd535] transition-colors duration-300">About Us</a>
                <a href="#pricing" className="hover:text-[#fcd535] transition-colors duration-300">Pricing</a>
                <a href="#contact" className="hover:text-[#fcd535] transition-colors duration-300">Contact</a>
            </div>
            <button onClick={onLoginClick} className="bg-[#fcd535] text-black px-6 py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#e5c230] transition-all duration-300 shadow-lg shadow-[#fcd535]/20">Login</button>
        </nav>

        {/* Hero Section with Image */}
        <section id="intro" className="relative py-32 px-6 container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left space-y-8 relative z-10">
                    <div className="inline-block px-4 py-2 bg-[#fcd535]/10 border border-[#fcd535]/30 rounded-full mb-4">
                        <span className="text-[#fcd535] text-xs font-bold uppercase tracking-wider">🔒 Institutional Grade Platform</span>
                    </div>
                    <h2 className="text-7xl font-black leading-tight uppercase">
                        Institutional <br />
                        <span className="text-[#fcd535] bg-gradient-to-r from-[#fcd535] to-[#f0a500] bg-clip-text text-transparent">Transparency</span>
                    </h2>
                    <p className="text-xl text-[#848e9c] max-w-xl leading-relaxed">
                        Replacing manual spreadsheets with professional, real-time client portfolio management and communication.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={onLoginClick} className="bg-[#fcd535] text-black px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#e5c230] transition-all duration-300 shadow-xl shadow-[#fcd535]/30 hover:shadow-[#fcd535]/50 hover:scale-105">
                            Get Started
                        </button>
                        <button className="border-2 border-[#fcd535] text-[#fcd535] px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-[#fcd535]/10 transition-all duration-300">
                            View Demo
                        </button>
                    </div>
                    <div className="flex gap-8 pt-8">
                        <div>
                            <div className="text-3xl font-black text-[#fcd535]">$2.4B+</div>
                            <div className="text-xs text-[#848e9c] uppercase">Assets Managed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-[#fcd535]">500+</div>
                            <div className="text-xs text-[#848e9c] uppercase">Active Clients</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-[#fcd535]">98%</div>
                            <div className="text-xs text-[#848e9c] uppercase">Satisfaction</div>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#fcd535] to-[#f0a500] rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <img
                        src="/images/hero-dashboard.png"
                        alt="Crypto Trading Dashboard"
                        className="relative rounded-2xl shadow-2xl border border-[#2b3139] hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
        </section>

        {/* About Section with Team Image */}
        <section id="about" className="py-20 bg-gradient-to-b from-[#0b0e11] to-[#12161c] relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-black mb-4 uppercase bg-gradient-to-r from-white to-[#848e9c] bg-clip-text text-transparent">The Cartel Advantage</h3>
                    <p className="text-[#848e9c] max-w-2xl mx-auto">Institutional-grade transparency meets personalized portfolio management</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="relative group order-2 md:order-1">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#fcd535] to-[#f0a500] rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <img
                            src="/images/team-analysis.png"
                            alt="Professional Team Analysis"
                            className="relative rounded-2xl shadow-2xl border border-[#2b3139] hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="space-y-8 order-1 md:order-2">
                        <div className="bg-[#1e2329]/50 backdrop-blur-sm p-8 rounded-xl border border-[#2b3139] hover:border-[#fcd535]/50 transition-all duration-300">
                            <h4 className="text-2xl font-bold text-[#fcd535] mb-4 flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#fcd535] rounded-full animate-pulse"></span>
                                WHO WE ARE
                            </h4>
                            <p className="text-[#848e9c] leading-relaxed">
                                Crypto Cartel is a premium trading advisory focused on high-net-worth individuals who demand full transparency. We bridge the gap between institutional analysis and personal portfolio deployment.
                            </p>
                        </div>

                        <div className="bg-[#1e2329]/50 backdrop-blur-sm p-8 rounded-xl border border-[#2b3139] hover:border-[#fcd535]/50 transition-all duration-300">
                            <h4 className="text-2xl font-bold text-[#fcd535] mb-4 flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#fcd535] rounded-full animate-pulse"></span>
                                OUR MISSION
                            </h4>
                            <p className="text-[#848e9c] leading-relaxed">
                                Our goal is to eliminate the fog of traditional crypto advisory. Through our dedicated portal, clients see every move, every entry, and every exit in real-time—no hidden spreadsheets, no delayed reports.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[#1e2329]/50 backdrop-blur-sm p-8 rounded-xl border border-[#2b3139] hover:border-[#0ecb81]/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs uppercase text-[#848e9c] font-bold tracking-wider">Portfolio Growth</span>
                            <span className="text-2xl">📈</span>
                        </div>
                        <div className="text-4xl font-black text-[#0ecb81] mb-2 group-hover:scale-110 transition-transform">+142%</div>
                        <div className="text-xs text-[#848e9c]">Year to Date Performance</div>
                    </div>

                    <div className="bg-[#1e2329]/50 backdrop-blur-sm p-8 rounded-xl border border-[#2b3139] hover:border-[#fcd535]/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs uppercase text-[#848e9c] font-bold tracking-wider">Win Rate</span>
                            <span className="text-2xl">🎯</span>
                        </div>
                        <div className="text-4xl font-black text-[#fcd535] mb-2 group-hover:scale-110 transition-transform">78.4%</div>
                        <div className="text-xs text-[#848e9c]">Successful Trade Ratio</div>
                    </div>

                    <div className="bg-[#1e2329]/50 backdrop-blur-sm p-8 rounded-xl border border-[#2b3139] hover:border-white/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs uppercase text-[#848e9c] font-bold tracking-wider">Transparency</span>
                            <span className="text-2xl">✓</span>
                        </div>
                        <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">100%</div>
                        <div className="text-xs text-[#848e9c]">Verified & Audited</div>
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing" className="py-24">
            <div className="container mx-auto px-6">
                <h3 className="text-2xl font-bold mb-16 uppercase text-center">Membership Tiers</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`p-8 rounded-xl border ${plan.popular ? 'border-[#fcd535] bg-[#1e2329]' : 'border-[#2b3139] bg-[#0b0e11]'} flex flex-col`}>
                            <h4 className="text-xl font-bold mb-2 uppercase">{plan.name}</h4>
                            <div className="text-3xl font-black mb-8 text-[#fcd535] uppercase">{plan.price}</div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="text-xs uppercase text-[#848e9c] flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-[#fcd535] rounded-full"></span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded font-bold text-xs uppercase ${plan.popular ? 'bg-[#fcd535] text-black' : 'bg-[#2b3139] text-white hover:bg-[#3b4149]'}`}>Choose Plan</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="contact" className="py-20 bg-[#12161c]">
            <div className="container mx-auto px-6 max-w-xl text-center">
                <h3 className="text-2xl font-bold mb-8 uppercase">Contact Us</h3>
                <p className="text-[#848e9c] mb-10 uppercase text-xs tracking-widest">Inquiries regarding institutional accounts or private placement.</p>
                <div className="space-y-4">
                    <input placeholder="NAME" className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded text-xs" />
                    <input placeholder="EMAIL" className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded text-xs" />
                    <textarea placeholder="MESSAGE" className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded h-32 text-xs" />
                    <button className="w-full bg-[#fcd535] text-black py-4 rounded font-bold text-xs uppercase tracking-widest">Send Inquiry</button>
                </div>
            </div>
        </section>

        <footer className="py-10 text-center text-[10px] text-[#848e9c] uppercase tracking-widest">
            &copy; 2024 Crypto Cartel Advisory. All rights reserved.
        </footer>
    </div>
);

export default Landing;
