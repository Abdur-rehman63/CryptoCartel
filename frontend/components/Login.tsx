import React, { useState } from 'react';

const Login: React.FC<{ onLogin: (e: string, p: string) => void, onBack: () => void }> = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(/images/login-bg.png)',
                        filter: 'brightness(0.3) blur(2px)',
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e11]/90 via-[#0b0e11]/80 to-[#12161c]/90"></div>

                {/* Animated Chart Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'url(/images/chart-pattern.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        animation: 'float 30s ease-in-out infinite'
                    }}
                ></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="text-xs text-[#848e9c] mb-6 uppercase tracking-widest hover:text-[#fcd535] transition-colors duration-300 flex items-center gap-2"
                >
                    <span>←</span> Back to Site
                </button>

                {/* Main Card */}
                <div className="bg-[#1e2329]/40 backdrop-blur-xl p-10 rounded-2xl border border-[#2b3139]/50 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#fcd535] to-[#f0a500] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fcd535]/20">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black mb-2 uppercase tracking-wider bg-gradient-to-r from-white to-[#848e9c] bg-clip-text text-transparent">
                            Secure Portal
                        </h2>
                        <p className="text-xs text-[#848e9c] uppercase tracking-widest">Institutional Access</p>
                    </div>

                    {/* Security Badge */}
                    <div className="mb-6 p-3 bg-[#0b0e11]/50 rounded-lg border border-[#2b3139]/50 flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#0ecb81] rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-[#848e9c] uppercase tracking-wider">256-bit Encrypted Connection</span>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-[10px] text-[#848e9c] uppercase tracking-wider mb-2 font-bold">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="your.email@institution.com"
                                    className="w-full bg-[#0b0e11]/80 border border-[#2b3139] p-4 rounded-lg text-sm text-white placeholder-[#848e9c]/50 focus:border-[#fcd535] focus:outline-none transition-all duration-300"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <svg className="w-5 h-5 text-[#848e9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-[10px] text-[#848e9c] uppercase tracking-wider mb-2 font-bold">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your secure password"
                                    className="w-full bg-[#0b0e11]/80 border border-[#2b3139] p-4 rounded-lg text-sm text-white placeholder-[#848e9c]/50 focus:border-[#fcd535] focus:outline-none transition-all duration-300"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848e9c] hover:text-[#fcd535] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-[#2b3139] bg-[#0b0e11] text-[#fcd535] focus:ring-[#fcd535] focus:ring-offset-0" />
                                <span className="text-[#848e9c] group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-[#fcd535] hover:text-[#e5c230] transition-colors uppercase tracking-wider font-bold">
                                Forgot?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={() => onLogin(email, password)}
                            className="w-full bg-gradient-to-r from-[#fcd535] to-[#f0a500] text-black py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-[#fcd535]/30 transition-all duration-300 hover:scale-[1.02] mt-6"
                        >
                            Access Portal
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#2b3139]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-4 bg-[#1e2329]/40 text-[#848e9c] tracking-wider">Demo Credentials</span>
                            </div>
                        </div>

                        {/* Demo Info */}
                        <div className="bg-[#0b0e11]/50 p-4 rounded-lg border border-[#2b3139]/50 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-[#848e9c] uppercase tracking-wider">Admin:</span>
                                <span className="text-xs text-[#fcd535] font-mono">admin@cryptocartel.com</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-[#848e9c] uppercase tracking-wider">Client:</span>
                                <span className="text-xs text-[#fcd535] font-mono">client@test.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-[10px] text-[#848e9c] uppercase tracking-widest">
                        Protected by Enterprise-Grade Security
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
