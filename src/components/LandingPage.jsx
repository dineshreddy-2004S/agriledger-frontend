import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf, Tractor, BarChart3, ShieldCheck, Star, 
  Users, LogOut, CheckCircle, XCircle, Trash2, Eye, 
  ArrowLeft, ArrowRight, LayoutDashboard, TrendingUp, 
  TrendingDown, PieChart, Plus, Menu, X, BookOpen, 
  Landmark, CreditCard, Edit, Shield, Activity, 
  DollarSign, Percent, Calendar, Tag, Download, 
  FileText, FileSpreadsheet, Globe, Zap, Smartphone, Heart, List
} from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .bg-gradient-animate {
    background: linear-gradient(-45deg, #15803d, #16a34a, #22c55e, #4ade80);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
  }
  .glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2); 
  }
`;

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <style>{styles}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] glass border-b border-green-100 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-green-700">
            <Leaf className="w-8 h-8 animate-float" />
            <span className="text-xl font-black tracking-tighter lg:text-2xl">AgriLedger</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-600 uppercase tracking-widest">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-green-600 transition-colors">How it Works</a>
            <a href="#stats" className="hover:text-green-600 transition-colors">Impact</a>
          </div>
          <div className="space-x-4">
            <button onClick={() => onNavigate('signin')} className="bg-indigo-700 hover:bg-indigo-950 text-white px-7 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-green-200 cursor-pointer transform hover:-translate-y-1 text-[6px] lg:text-[16px]">LOG IN</button>
            <button onClick={() => onNavigate('signup')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-green-200 cursor-pointer transform hover:-translate-y-1 text-[6px] lg:text-[16px]">
              JOIN NOW
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-green-50/50 -z-10 skew-y-3 origin-top-left transform scale-110"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 bg-white border border-green-200 text-green-800 px-4 py-2 rounded-full mb-8 text-sm font-bold shadow-sm animate-fadeIn">
            <Star className="w-4 h-4 fill-green-600 text-green-600" />
            <span>#1 FARM ACCOUNTING TOOL</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 tracking-tighter leading-[0.9] animate-fadeIn">
            Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Wealth</span>, <br />
            Not Just Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Crops</span>.
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            AgriLedger provides bank-grade financial clarity for modern agriculture. Manage expenses, track assets, and maximize profits with zero paperwork.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button onClick={() => onNavigate('signup')} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full text-xl font-black shadow-2xl transition-all transform hover:scale-110 active:scale-95">
              GET STARTED FREE
            </button>
            <button onClick={() => onNavigate('signin')} className="w-full sm:w-auto bg-white border-4 border-gray-100 hover:border-green-600 hover:text-green-700 text-gray-900 px-10 py-5 rounded-full text-xl font-black transition-all">
              LIVE DEMO
            </button>
          </div>
        </div>
      </header>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <h2 className="text-4xl font-black text-gray-900 leading-tight">Digital Revolution for the <span className="text-green-600">Indian Soil</span></h2>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl">1</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">List Your Crop Fields</h4>
                                <p className="text-gray-500">Map your Wheat, Paddy, or Cotton fields once. Track seasons (Rabi/Kharif) automatically.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl">2</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Snapshot Expenses</h4>
                                <p className="text-gray-500">Record labor costs, fertilizer bills, and diesel expenses on the fly using our mobile-ready app.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl">3</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Instant Profit Insight</h4>
                                <p className="text-gray-500">Don't wait for the harvest to know your balance. Real-time dashboards show your net worth every day.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <div className="bg-gradient-animate rounded-3xl p-1 shadow-2xl rotate-3">
                        <div className="bg-white rounded-[22px] overflow-hidden -rotate-3 transition-transform hover:rotate-0 duration-500">
                            <img 
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ZKIdZ1dwn9bg1X8WQvzAjg6wYn9fcXJl8Q&s" 
                              alt="Farm Management App View" 
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-gray-900">Live Yield Projections</h3>
                                    <Activity className="text-green-600" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-100 rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[75%] transition-all duration-1000"></div>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[45%] transition-all duration-1000"></div>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full w-full overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[90%] transition-all duration-1000"></div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex justify-between font-bold">
                                        <span>Estimated Earnings</span>
                                        <span className="text-green-600">₹8,45,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Everything You Need to <span className="text-green-600">Grow</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Powerful features wrapped in a simple interface built for rural and urban farmers alike.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, color: "bg-green-100 text-green-600", title: "Audit-Ready Data", desc: "Our reports are accepted by major Indian banks for crop loans and insurance claims." },
              { icon: <Smartphone className="w-8 h-8" />, color: "bg-blue-100 text-blue-600", title: "Offline Support", desc: "No internet in the field? No problem. Record your data offline; we sync when you're back." },
              { icon: <Zap className="w-8 h-8" />, color: "bg-yellow-100 text-yellow-600", title: "Instant Export", desc: "Download PDF or Excel reports in one click to share with your family or accountant." },
              { icon: <Smartphone className="w-8 h-8" />, color: "bg-indigo-100 text-indigo-600", title: "Multi-User Access", desc: "Let your manager or family members record data while you maintain full control." },
              { icon: <TrendingUp className="w-8 h-8" />, color: "bg-rose-100 text-rose-600", title: "Price Alerts", desc: "Stay informed about market mandi prices to decide the best time to sell your harvest." },
              { icon: <Shield className="w-8 h-8" />, color: "bg-purple-100 text-purple-600", title: "Encrypted Cloud", desc: "Your financial history is your business. We use 256-bit encryption to keep it private." }
            ].map((f, i) => (
                <div key={i} className="p-8 bg-white border-2 border-transparent hover:border-green-400 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
                    <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        {f.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-gray-900">{f.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-animate rounded-[40px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Ready to take control?</h2>
                <p className="text-xl mb-10 text-green-50 max-w-xl mx-auto">Join thousands of farmers who are using AgriLedger to modernize their farm businesses today.</p>
                <button onClick={() => onNavigate('signup')} className="bg-white text-green-700 px-12 py-5 rounded-full text-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
                    START FOR FREE
                </button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <div className="flex items-center space-x-2 text-green-700 mb-8">
                <Leaf className="w-8 h-8" />
                <span className="text-2xl font-black tracking-tighter">AgriLedger</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between w-full border-b border-gray-100 pb-12 mb-12 gap-8 text-center md:text-left">
                <div className="flex-1">
                    <h4 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-sm">Our Mission</h4>
                    <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0">
                        To empower every farmer with the tools of modern finance, ensuring the sustainability and profitability of global agriculture.
                    </p>
                </div>
                <div className="flex space-x-12 justify-center md:justify-end">
                    <div>
                        <h4 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-sm">Product</h4>
                        <ul className="space-y-2 text-gray-400 font-bold">
                            <li className="hover:text-green-600 cursor-pointer transition-colors">Pricing</li>
                            <li className="hover:text-green-600 cursor-pointer transition-colors">Security</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-sm">Support</h4>
                        <ul className="space-y-2 text-gray-400 font-bold">
                            <li className="hover:text-green-600 cursor-pointer transition-colors">Contact</li>
                            <li className="hover:text-green-600 cursor-pointer transition-colors">Documentation</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* DINESH REDDY PROFILE SECTION */}
            <div className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-2">
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-20 group-hover:opacity-60 transition-opacity"></div>
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-10 bg-gray-100">
                        {/* Profile Image with Fallback */}
                        <img 
                          src="https://avatars.githubusercontent.com/u/169218157?v=4" 
                          alt="Dinesh Reddy - Lead Developer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                             e.target.style.display = 'none';
                             e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white font-black text-2xl">
                           DR
                        </div>
                    </div>
                </div>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">Dinesh Reddy</h4>
                <p className="text-green-600 font-black text-xs uppercase tracking-[0.2em] mb-2">Lead Developer & Founder</p>
                <div className="flex space-x-4 mt-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                </div>
            </div>

            <div className="mt-12 text-center text-xs font-bold text-gray-300 uppercase tracking-[0.3em]">
                &copy; {new Date().getFullYear()} AgriLedger. Crafted with care by Dinesh Reddy.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;