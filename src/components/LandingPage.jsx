import React from 'react';
import { Leaf, Tractor, BarChart3, ShieldCheck, Star } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <nav className="bg-white shadow-sm border-b border-green-100 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-green-700">
            <Leaf className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">AgriLedger</span>
          </div>
          <div className="space-x-4">
            <button onClick={() => onNavigate('signin')} className="text-gray-600 hover:text-green-700 font-medium transition-colors">Log In</button>
            <button onClick={() => onNavigate('signup')} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Sign Up Free
            </button>
          </div>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8 text-sm font-semibold">
          <Star className="w-4 h-4 fill-current" />
          <span>Trusted by 10,000+ Farmers Across India</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Smart Accounting for <br className="hidden md:block" />
          <span className="text-green-600">Modern Agriculture</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track every seed, fertilizer, and harvest. Know your exact profit or loss per crop. Highly secure, easy-to-use software built specifically for the farming community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button onClick={() => onNavigate('signup')} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-transform transform hover:scale-105">
            Start Managing Your Farm
          </button>
          <button onClick={() => onNavigate('signin')} className="w-full sm:w-auto bg-white border-2 border-gray-200 hover:border-green-600 hover:text-green-700 text-gray-700 px-8 py-4 rounded-full text-lg font-bold shadow-sm transition-all">
            Log In to Dashboard
          </button>
        </div>
      </header>

      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Grow Your Profits</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">We've simplified farm accounting so you can spend less time on paperwork and more time in the field.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Tractor className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Crop-Based Tracking</h3>
              <p className="text-gray-600 leading-relaxed">Organize your finances by individual crops and seasons. Never guess which field is the most profitable again.</p>
            </div>
            
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Detailed Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Generate instantly understandable profit/loss reports. Export them for bank loans, subsidies, or tax purposes.</p>
            </div>
            
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Bank-Level Security</h3>
              <p className="text-gray-600 leading-relaxed">Your financial data is encrypted and securely stored in the cloud. We prioritize your privacy above all else.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-white mb-4 md:mb-0">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold tracking-tight">AgriLedger</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 text-center text-sm text-gray-600 border-t border-gray-800 pt-8">
          &copy; {new Date().getFullYear()} AgriLedger Solutions. Empowering Farmers Everywhere.
        </div>
      </footer>
    </div>
  );
}