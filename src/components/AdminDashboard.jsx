import React, { useState, useEffect } from 'react';
import { Users, LogOut, CheckCircle, XCircle, Trash2, Eye, ArrowLeft, List } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  
  // States for Detailed View navigation
  const [viewMode, setViewMode] = useState('users'); // 'users', 'ledgers', 'transactions'
  const [activeUser, setActiveUser] = useState(null);
  const [activeLedger, setActiveLedger] = useState(null);
  const [userLedgers, setUserLedgers] = useState([]);
  const [userTxs, setUserTxs] = useState([]);
  const [userCrops, setUserCrops] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      // FIXED API URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (err) {
      const localUsers = JSON.parse(localStorage.getItem('agri_users') || '[]');
      setUsers(localUsers.filter(u => u.role === 'farmer'));
    }
  };

  const toggleAccess = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      // FIXED API URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/access`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_approved: !currentStatus })
      });
      
      if (!res.ok) throw new Error("Failed to update");
      fetchUsers();
    } catch (err) {
      const localUsers = JSON.parse(localStorage.getItem('agri_users') || '[]');
      const updated = localUsers.map(u => u.id === userId ? { ...u, is_approved: !currentStatus } : u);
      localStorage.setItem('agri_users', JSON.stringify(updated));
      fetchUsers();
    }
  };

  const deleteUser = async (userId) => {
    if(!window.confirm("Are you sure you want to delete this user? All their crops and transactions will also be permanently lost.")) return;
    
    try {
      const token = localStorage.getItem('token');
      // FIXED API URL
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      fetchUsers();
    } catch (err) {
      const localUsers = JSON.parse(localStorage.getItem('agri_users') || '[]');
      const updatedUsers = localUsers.filter(u => u.id !== userId);
      localStorage.setItem('agri_users', JSON.stringify(updatedUsers));
      fetchUsers();
    }
  };

  const viewUserDetails = async (user) => {
    setActiveUser(user);
    try {
      const token = localStorage.getItem('token');
      // FIXED API URLs
      const [ledgersRes, txsRes, cropsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}/ledgers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}/transactions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}/crops`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (!ledgersRes.ok || !txsRes.ok || !cropsRes.ok) throw new Error("Failed to fetch detailed data");
      
      setUserLedgers(await ledgersRes.json());
      setUserTxs(await txsRes.json());
      setUserCrops(await cropsRes.json());
    } catch (err) {
      const allLedgers = JSON.parse(localStorage.getItem('agri_ledgers') || '[]');
      const allTxs = JSON.parse(localStorage.getItem('agri_txs') || '[]');
      const allCrops = JSON.parse(localStorage.getItem('agri_crops') || '[]');

      setUserLedgers(allLedgers.filter(l => l.user_id === user.id));
      setUserTxs(allTxs.filter(t => t.user_id === user.id));
      setUserCrops(allCrops.filter(c => c.user_id === user.id));
    }
    setViewMode('ledgers');
  };

  const viewTransactions = (ledger) => {
    setActiveLedger(ledger);
    setViewMode('transactions');
  };

  const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold">Admin Dinesh Reddy</span>
        </div>
        <div className="p-4 flex-1">
          <button 
            onClick={() => setViewMode('users')} 
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${viewMode === 'users' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" />
            <span>Manage Farmers</span>
          </button>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {viewMode === 'users' && (
          <>
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Farmer Access Approvals</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={`user-${user.id || index}`} className="border-b hover:bg-gray-50 text-sm">
                      <td className="p-4 font-medium text-gray-800">{user.name}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {user.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end space-x-2">
                        <button 
                          onClick={() => viewUserDetails(user)}
                          className="flex items-center justify-center px-3 py-2 rounded-lg font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                          title="Detailed View"
                        >
                          <Eye className="w-5 h-5"/>
                        </button>
                        <button 
                          onClick={() => toggleAccess(user.id, user.is_approved)}
                          className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white transition-colors ${user.is_approved ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                          title={user.is_approved ? 'Revoke Access' : 'Approve User'}
                        >
                          {user.is_approved ? <><XCircle className="w-4 h-4 md:mr-2"/><span className="hidden md:inline">Revoke</span></> : <><CheckCircle className="w-4 h-4 md:mr-2"/><span className="hidden md:inline">Approve</span></>}
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="flex items-center justify-center px-3 py-2 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No farmers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {viewMode === 'ledgers' && (
          <>
            <div className="flex items-center mb-8">
              <button 
                onClick={() => setViewMode('users')} 
                className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600"/>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{activeUser?.name}'s Ledgers</h1>
                <p className="text-gray-500 text-sm mt-1">Select a ledger to view related transactions.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="p-4 font-medium">Ledger Name</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userLedgers.map((ledger, idx) => (
                    <tr key={`ledger-${ledger.id || idx}`} className="border-b hover:bg-gray-50 text-sm">
                      <td className="p-4 font-medium text-gray-800">{ledger.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium 
                              ${ledger.type === 'Income' ? 'bg-green-100 text-green-700' : 
                                ledger.type === 'Expense' ? 'bg-red-100 text-red-700' : 
                                ledger.type === 'Asset' ? 'bg-purple-100 text-purple-700' : 
                                'bg-yellow-100 text-yellow-700'}`}>
                              {ledger.type}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => viewTransactions(ledger)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
                        >
                          <List className="w-4 h-4 mr-2" /> View Transactions
                        </button>
                      </td>
                    </tr>
                  ))}
                  {userLedgers.length === 0 && (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-500">This user has not created any ledgers yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {viewMode === 'transactions' && (
          <>
            <div className="flex items-center mb-8">
              <button 
                onClick={() => setViewMode('ledgers')} 
                className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600"/>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Transactions for {activeLedger?.name}</h1>
                <p className="text-gray-500 text-sm mt-1">Farmer: {activeUser?.name}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Crop</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {userTxs.filter(tx => tx.category === activeLedger.name).map((tx, idx) => {
                    const crop = userCrops.find(c => c.id === tx.crop_id);
                    return (
                      <tr key={`tx-${tx.id || idx}`} className="border-b hover:bg-gray-50 text-sm">
                        <td className="p-4 text-gray-500">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                        <td className="p-4 font-medium text-gray-800">{crop ? crop.name : 'Unknown Crop'}</td>
                        <td className="p-4 text-gray-600">{tx.description || '-'}</td>
                        <td className={`p-4 text-right font-bold ${['Income', 'Asset'].includes(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                          {['Income', 'Asset'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}
                  {userTxs.filter(tx => tx.category === activeLedger.name).length === 0 && (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No transactions recorded under this ledger yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}  