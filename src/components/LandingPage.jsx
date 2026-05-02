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

// Environment safe API configuration
const API_BASE = 'https://agriledger-backend.onrender.com/api';

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

// ==========================================
// 1. LANDING PAGE COMPONENT
// ==========================================
const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <style>{styles}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] glass border-b border-green-100 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-green-700">
            <Leaf className="w-8 h-8 animate-float" />
            <span className="text-2xl font-black tracking-tighter">AgriLedger</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-600 uppercase tracking-widest">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-green-600 transition-colors">How it Works</a>
            <a href="#stats" className="hover:text-green-600 transition-colors">Impact</a>
          </div>
          <div className="space-x-4">
            <button onClick={() => onNavigate('signin')} className="text-gray-600 hover:text-green-700 font-bold transition-all">LOG IN</button>
            <button onClick={() => onNavigate('signup')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-green-200 transform hover:-translate-y-1">
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

// ==========================================
// 2. AUTH PAGE COMPONENT
// ==========================================
const AuthPage = ({ type, onAuthenticate, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = type === 'signin' ? '/signin' : '/signup';
    const payload = type === 'signin' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      if (type === 'signup') {
        onNavigate('signin');
      } else {
        localStorage.setItem('token', data.token);
        onAuthenticate(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center">
            <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4 animate-float" />
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                {type === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Manage your farm finances like a pro.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-fadeIn">
                {error}
            </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {type === 'signup' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required 
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  placeholder="John Doe" 
                />
              </div>
          )}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
              placeholder="farmer@example.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl text-lg font-black shadow-xl hover:shadow-green-100 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : (type === 'signin' ? 'LOG IN' : 'SIGN UP')}
          </button>
        </form>

        <div className="text-center pt-4">
            <button 
                onClick={() => onNavigate(type === 'signin' ? 'signup' : 'signin')}
                className="text-gray-400 font-bold text-sm hover:text-green-600 transition-colors"
            >
                {type === 'signin' ? "Don't have an account? Join Now" : "Already have an account? Log In"}
            </button>
            <div className="mt-6">
                <button onClick={() => onNavigate('landing')} className="text-green-600 font-black text-xs uppercase tracking-widest hover:underline">
                    ← Back to Homepage
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ADMIN DASHBOARD
// ==========================================
const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
  };

  const toggleAccess = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/admin/users/${userId}/access`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_approved: !currentStatus })
      });
      if (res.ok) fetchUsers();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shrink-0">
        <div className="flex items-center space-x-2 mb-10">
          <ShieldCheck className="text-green-500 w-8 h-8" />
          <span className="text-xl font-black tracking-tighter">AdminPortal</span>
        </div>
        <nav className="space-y-4">
          <button className="flex items-center space-x-3 w-full p-4 bg-gray-800 rounded-2xl text-green-400 font-bold">
            <Users className="w-5 h-5" />
            <span>Farmers</span>
          </button>
          <button onClick={onLogout} className="flex items-center space-x-3 w-full p-4 hover:bg-gray-800 rounded-2xl text-red-400 font-bold transition-all">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Access Approvals</h1>
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Name</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Email</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-bold text-gray-800">{u.name}</td>
                  <td className="p-6 text-gray-500">{u.email}</td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${u.is_approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {u.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => toggleAccess(u.id, u.is_approved)}
                      className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${u.is_approved ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100'}`}
                    >
                      {u.is_approved ? 'REVOKE' : 'APPROVE'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// ==========================================
// 4. FARMER DASHBOARD
// ==========================================
const FarmerDashboard = ({ user, onLogout }) => {
  const [crops, setCrops] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [cRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/crops`, { headers }),
        fetch(`${API_BASE}/transactions`, { headers })
      ]);
      if (cRes.ok) setCrops(await cRes.json());
      if (tRes.ok) setTransactions(await tRes.json());
    } catch (err) { console.error(err); }
  };

  const stats = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
        if (t.type === 'Income') inc += Number(t.amount);
        if (t.type === 'Expense') exp += Number(t.amount);
    });
    return { income: inc, expense: exp, profit: inc - exp };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-green-800 text-white p-6 shrink-0">
        <div className="flex items-center space-x-2 mb-10">
          <Leaf className="w-8 h-8" />
          <span className="text-xl font-black tracking-tighter">AgriLedger</span>
        </div>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center space-x-3 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-green-700' : 'hover:bg-green-700/50'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`flex items-center space-x-3 w-full p-4 rounded-2xl font-bold transition-all ${activeTab === 'reports' ? 'bg-green-700' : 'hover:bg-green-700/50'}`}>
            <PieChart className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button onClick={onLogout} className="flex items-center space-x-3 w-full p-4 hover:bg-green-900 rounded-2xl text-green-200 font-bold transition-all">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight italic">Welcome back, {user.name}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
                    <TrendingUp className="text-green-500 mb-4 w-8 h-8" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Income</p>
                    <h3 className="text-3xl font-black text-gray-900">₹{stats.income.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
                    <TrendingDown className="text-red-500 mb-4 w-8 h-8" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Expense</p>
                    <h3 className="text-3xl font-black text-gray-900">₹{stats.expense.toLocaleString()}</h3>
                </div>
                <div className="bg-green-600 p-8 rounded-[32px] shadow-2xl text-white">
                    <BarChart3 className="text-green-200 mb-4 w-8 h-8" />
                    <p className="text-xs font-black text-green-200 uppercase tracking-widest">Net Profit</p>
                    <h3 className="text-3xl font-black">₹{stats.profit.toLocaleString()}</h3>
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h3>
                    <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-2xl transition-all"><List className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                    {transactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] hover:scale-[1.01] transition-transform">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {t.type === 'Income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{t.category}</h4>
                                    <p className="text-xs text-gray-400 font-bold">{new Date(t.transaction_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`font-black ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'Income' ? '+' : '-'} ₹{Number(t.amount).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

// ==========================================
// 5. MAIN APP CONTROLLER
// ==========================================
export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        setView(u.role === 'admin' ? 'admin' : 'farmer');
    }
  }, []);

  const handleAuthenticate = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setView(userData.role === 'admin' ? 'admin' : 'farmer');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('landing');
  };

  return (
    <>
      <style>{styles}</style>
      {view === 'landing' && <LandingPage onNavigate={setView} />}
      {['signin', 'signup'].includes(view) && (
        <AuthPage 
            type={view} 
            onAuthenticate={handleAuthenticate} 
            onNavigate={setView} 
        />
      )}
      {view === 'admin' && user?.role === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      {view === 'farmer' && user && (
        <FarmerDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}