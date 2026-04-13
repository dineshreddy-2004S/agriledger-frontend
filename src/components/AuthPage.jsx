import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

export default function AuthPage({ type, onAuthenticate, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    let endpoint = '';
    let payload = {};

    if (type === 'signin') { endpoint = '/api/signin'; payload = { email, password }; }
    else if (type === 'signup') { endpoint = '/api/signup'; payload = { name, email, password }; }
    else if (type === 'forgot-password') { endpoint = '/api/forgot-password'; payload = { email }; }
    else if (type === 'forgot-user') { endpoint = '/api/forgot-user'; payload = { name }; }

    try {
      // FIXED: Using the VITE_API_URL environment variable instead of localhost
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 500 && (type === 'forgot-password' || type === 'forgot-user')) {
           throw new Error("Backend Email Not Configured"); 
        }
        setError(data.error || 'Something went wrong');
        return;
      }

      if (type === 'signup') {
        setSuccessMsg(data.message);
        setTimeout(() => onNavigate('signin'), 3000);
      } else if (type === 'forgot-password' || type === 'forgot-user') {
        setSuccessMsg(data.message);
        if (type === 'forgot-password') setTimeout(() => onNavigate('signin'), 4000);
      } else {
        localStorage.setItem('token', data.token);
        onAuthenticate(data.user);
      }
    } catch (err) {
      console.warn("Backend not reachable or Email not configured. Falling back to local preview mode.", err);
      
      const localUsers = JSON.parse(localStorage.getItem('agri_users') || '[]');

      if (type === 'signup') {
        if (localUsers.find(u => u.email === email)) {
          setError("Email already exists.");
          return;
        }
        localUsers.push({ id: Date.now(), name, email, password, role: 'farmer', is_approved: true }); 
        localStorage.setItem('agri_users', JSON.stringify(localUsers));
        
        setSuccessMsg("Registration successful! (Preview Mode)");
        setTimeout(() => onNavigate('signin'), 2000);

      } else if (type === 'forgot-password') {
        setSuccessMsg("If your email is registered, you will receive a password reset link shortly. (Preview Mode)");
        setTimeout(() => onNavigate('signin'), 4000);

      } else if (type === 'forgot-user') {
        const user = localUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (user) {
          setSuccessMsg(`Account found! Your registered email is: ${user.email}`);
        } else {
          setError("We couldn't find an account with that name.");
        }

      } else {
        if (email === 'admin@farm.com' && password === 'admin123') {
           onAuthenticate({ id: 0, name: 'Super Admin', email: 'admin@farm.com', role: 'admin' });
           return;
        }

        const user = localUsers.find(u => u.email === email && u.password === password);
        if (user) {
          if (!user.is_approved && user.role !== 'admin') {
            setError("Your account is pending Admin approval.");
          } else {
            localStorage.setItem('token', 'dummy-preview-token');
            onAuthenticate({ id: user.id, name: user.name, email: user.email, role: user.role });
          }
        } else {
          setError("Invalid email or password.");
        }
      }
    }
  };

  const getTitle = () => {
    if (type === 'signin') return 'Sign in to your account';
    if (type === 'signup') return 'Create your free account';
    if (type === 'forgot-password') return 'Reset your password';
    if (type === 'forgot-user') return 'Find your account email';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-gray-900">{getTitle()}</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>}
          {successMsg && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded border border-green-100">{successMsg}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {(type === 'signup' || type === 'forgot-user') && (
               <div>
                 <label className="block text-sm font-medium text-gray-700">Full Name</label>
                 <input 
                   type="text" 
                   value={name} 
                   onChange={e => setName(e.target.value)} 
                   required 
                   placeholder={type === 'forgot-user' ? "Enter your registered name" : ""}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" 
                 />
               </div>
            )}

            {type !== 'forgot-user' && (
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Email address</label>
                  {type === 'signin' && (
                    <button type="button" onClick={() => onNavigate('forgot-user')} className="text-xs font-medium text-green-600 hover:text-green-500">Forgot email?</button>
                  )}
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" 
                />
              </div>
            )}

            {(type === 'signin' || type === 'signup') && (
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  {type === 'signin' && (
                    <button type="button" onClick={() => onNavigate('forgot-password')} className="text-xs font-medium text-green-600 hover:text-green-500">Forgot password?</button>
                  )}
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" 
                />
              </div>
            )}

            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              {type === 'signin' ? 'Sign In' : 
               type === 'signup' ? 'Sign Up' : 
               type === 'forgot-password' ? 'Send Reset Link' : 'Find My Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {type === 'signin' && (
              <span className="text-gray-600">Don't have an account? <button onClick={() => onNavigate('signup')} className="text-green-600 font-medium hover:underline">Sign up</button></span>
            )}
            {type === 'signup' && (
              <span className="text-gray-600">Already have an account? <button onClick={() => onNavigate('signin')} className="text-green-600 font-medium hover:underline">Sign in</button></span>
            )}
            {(type === 'forgot-password' || type === 'forgot-user') && (
              <button onClick={() => onNavigate('signin')} className="text-green-600 font-medium hover:underline flex justify-center items-center w-full">
                ← Back to Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}