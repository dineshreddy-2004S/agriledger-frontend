import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf, LayoutDashboard, TrendingUp, TrendingDown, PieChart, 
  LogOut, Plus, BarChart3, Tractor, Menu, X, BookOpen, Landmark, 
  CreditCard, Edit, Trash2, Shield, Eye, ArrowLeft, List, Activity, 
  DollarSign, Percent, Calendar, Tag, Download, FileText, FileSpreadsheet
} from 'lucide-react';

export default function FarmerDashboard({ user, onLogout }) {
  const [crops, setCrops] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [activeLedger, setActiveLedger] = useState(null); 
  const [analyticsPeriod, setAnalyticsPeriod] = useState('monthly'); 
  
  // Modal States
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  
  // Edit States
  const [editingTx, setEditingTx] = useState(null);
  const [editingLedger, setEditingLedger] = useState(null);
  const [txFormType, setTxFormType] = useState('Expense');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Dynamic Library Loading Status
  const [libsLoaded, setLibsLoaded] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadExternalLibs();
  }, [user]);

  const loadExternalLibs = async () => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      if (window.jspdf && window.jspdf.jsPDF) {
        window.jsPDF = window.jspdf.jsPDF;
      }
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
      ]);

      setLibsLoaded(true);
    } catch (err) {
      console.error("Critical: Failed to load export libraries", err);
    }
  };

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token');
    
    if (token && token !== 'dummy-preview-token') {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            // FIXED API URLs
            const [cropsRes, txsRes, ledgersRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/crops`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, { headers }),
                fetch(`${import.meta.env.VITE_API_URL}/api/ledgers`, { headers })
            ]);
            
            if (cropsRes.ok) setCrops(await cropsRes.json());
            if (txsRes.ok) setTransactions(await txsRes.json());
            if (ledgersRes.ok) setLedgers(await ledgersRes.json());
            
            return; 
        } catch (err) {
            console.warn("DB fetch failed, falling back to local storage", err);
        }
    }

    const allCrops = JSON.parse(localStorage.getItem('agri_crops') || '[]');
    const allTxs = JSON.parse(localStorage.getItem('agri_txs') || '[]');
    const allLedgers = JSON.parse(localStorage.getItem('agri_ledgers') || '[]');
    
    const userCrops = allCrops.filter(c => c.user_id === user.id);
    const userTxs = allTxs.filter(t => t.user_id === user.id);
    const userLedgers = allLedgers.filter(l => l.user_id === user.id);

    setCrops(userCrops);
    setTransactions(userTxs);
    setLedgers(userLedgers);
  };

  const cropStats = useMemo(() => {
    return crops.map(c => {
       const cropTxs = transactions.filter(t => t.crop_id === c.id);
       const income = cropTxs.filter(t => t.type === 'Income').reduce((sum, t) => sum + Number(t.amount), 0);
       const expense = cropTxs.filter(t => t.type === 'Expense').reduce((sum, t) => sum + Number(t.amount), 0);
       return { ...c, crop_id: c.id, total_income: income, total_expense: expense };
    });
  }, [crops, transactions]);

  const stats = useMemo(() => {
    let income = 0, expense = 0, asset = 0, liability = 0;
    
    transactions.forEach(tx => {
      const amt = Number(tx.amount);
      if (tx.type === 'Income') income += amt;
      if (tx.type === 'Expense') expense += amt;
      if (tx.type === 'Asset') asset += amt;
      if (tx.type === 'Liability') liability += amt;
    });

    return { 
      income, 
      expense, 
      profit: income - expense,
      asset,
      liability,
      netWorth: asset - liability
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (analyticsPeriod === 'all') return transactions;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0); 

    switch (analyticsPeriod) {
        case 'daily': break;
        case 'weekly': cutoff.setDate(cutoff.getDate() - 7); break;
        case 'monthly': cutoff.setDate(cutoff.getDate() - 30); break;
        case 'quarterly': cutoff.setMonth(cutoff.getMonth() - 3); break;
        case 'halfyearly': cutoff.setMonth(cutoff.getMonth() - 6); break;
        case 'annually': cutoff.setFullYear(cutoff.getFullYear() - 1); break;
        default: break;
    }

    return transactions.filter(t => new Date(t.transaction_date) >= cutoff);
  }, [transactions, analyticsPeriod]);

  const analyticsStats = useMemo(() => {
      let income = 0, expense = 0;
      filteredTransactions.forEach(tx => {
          const amt = Number(tx.amount);
          if (tx.type === 'Income') income += amt;
          if (tx.type === 'Expense') expense += amt;
      });
      return { income, expense, profit: income - expense };
  }, [filteredTransactions]);
  
  const expenseByCategory = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'Expense');
    const total = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    if (total === 0) return [];
    
    const grouped = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
    }, {});
    
    return Object.entries(grouped)
        .map(([name, amount]) => ({ name, amount, percentage: (amount / total) * 100 }))
        .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  const cashflowData = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(t => {
        if(t.type !== 'Income' && t.type !== 'Expense') return;
        const d = new Date(t.transaction_date);
        
        let label;
        if (['daily', 'weekly', 'monthly'].includes(analyticsPeriod)) {
            label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        } else {
            label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
        }
        
        if(!groups[label]) {
            groups[label] = { income: 0, expense: 0, label, timestamp: d.getTime() };
        }
        if(t.type === 'Income') groups[label].income += Number(t.amount);
        if(t.type === 'Expense') groups[label].expense += Number(t.amount);
    });
    
    return Object.values(groups).sort((a,b) => a.timestamp - b.timestamp);
  }, [filteredTransactions, analyticsPeriod]);

  const maxCashflow = useMemo(() => {
    if (cashflowData.length === 0) return 1;
    return Math.max(...cashflowData.map(m => Math.max(m.income, m.expense))) || 1;
  }, [cashflowData]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };
  const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportTransactionsToExcel = (dataList, title = "Transactions") => {
    if (!window.XLSX) {
      showToast("Excel exporter not ready. Please wait...");
      return;
    }
    const excelData = dataList.map(tx => {
      const crop = crops.find(c => c.id === tx.crop_id);
      return {
        Date: formatDate(tx.transaction_date),
        Crop: crop ? crop.name : 'N/A',
        Type: tx.type,
        Category: tx.category,
        Amount: tx.amount,
        Description: tx.description || ''
      };
    });
    const worksheet = window.XLSX.utils.json_to_sheet(excelData);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    window.XLSX.writeFile(workbook, `AgriLedger_${title}_${new Date().getTime()}.xlsx`);
    showToast("Excel Export Started");
  };

  const exportTransactionsToPDF = (dataList, title = "Transaction Report") => {
    if (!libsLoaded || !window.jsPDF) {
      showToast("PDF exporter not ready. Please wait...");
      return;
    }
    
    const doc = new window.jsPDF();
    
    doc.setFontSize(18);
    doc.text("AgriLedger - " + title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Farmer: ${user.name} | Generated: ${formatDate(new Date())}`, 14, 28);

    const tableRows = dataList.map(tx => {
      const crop = crops.find(c => c.id === tx.crop_id);
      return [
        formatDate(tx.transaction_date),
        crop ? crop.name : 'N/A',
        tx.type,
        tx.category,
        `Rs. ${Number(tx.amount).toLocaleString('en-IN')}`,
        tx.description || ''
      ];
    });

    doc.autoTable({
      head: [['Date', 'Crop', 'Type', 'Category', 'Amount', 'Description']],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [21, 128, 61] }
    });

    doc.save(`AgriLedger_${title.replace(/\s+/g, '_')}.pdf`);
    showToast("PDF Export Started");
  };

  const exportAnalyticsToExcel = () => {
    if (!window.XLSX) {
      showToast("Exporter not ready. Try again in a moment.");
      return;
    }
    const summary = [
      { Metric: "Net Operating Profit", Value: stats.profit },
      { Metric: "Total Income", Value: stats.income },
      { Metric: "Total Expense", Value: stats.expense },
      { Metric: "Total Assets", Value: stats.asset },
      { Metric: "Total Liabilities", Value: stats.liability },
      { Metric: "Net Worth", Value: stats.netWorth }
    ];
    const worksheet = window.XLSX.utils.json_to_sheet(summary);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Summary");
    window.XLSX.writeFile(workbook, `AgriLedger_Analytics_Summary.xlsx`);
    showToast("Summary Exported to Excel");
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const txData = {
      crop_id: parseInt(formData.get('cropId')),
      type: formData.get('type'),
      category: formData.get('category'),
      amount: parseFloat(formData.get('amount')),
      transaction_date: formData.get('date'),
      description: formData.get('description')
    };

    const token = localStorage.getItem('token');
    
    if (token && token !== 'dummy-preview-token') {
        try {
            const method = editingTx ? 'PUT' : 'POST';
            // FIXED API URLs
            const url = editingTx ? `${import.meta.env.VITE_API_URL}/api/transactions/${editingTx.id}` : `${import.meta.env.VITE_API_URL}/api/transactions`;
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(txData)
            });
            
            if (res.ok) {
                showToast(`Transaction ${editingTx ? 'updated' : 'recorded'} in database!`);
                setShowAddTx(false);
                setEditingTx(null);
                loadDashboardData();
                return;
            }
        } catch (err) { console.error(err); }
    }

    txData.id = editingTx ? editingTx.id : Date.now();
    txData.user_id = user.id;
    const allTxs = JSON.parse(localStorage.getItem('agri_txs') || '[]');

    if (editingTx) {
      const updatedAll = allTxs.map(t => t.id === editingTx.id ? txData : t);
      localStorage.setItem('agri_txs', JSON.stringify(updatedAll));
      showToast("Transaction updated! (Local)");
    } else {
      localStorage.setItem('agri_txs', JSON.stringify([txData, ...allTxs]));
      showToast("Transaction successfully recorded! (Local)");
    }
    
    loadDashboardData();
    setShowAddTx(false);
    setEditingTx(null);
  };

  const deleteTransaction = async (id) => {
    if(!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    const token = localStorage.getItem('token');
    if (token && token !== 'dummy-preview-token') {
        try {
            // FIXED API URL
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                showToast("Transaction deleted from database.");
                loadDashboardData();
                return;
            }
        } catch (err) { console.error(err); }
    }

    const allTxs = JSON.parse(localStorage.getItem('agri_txs') || '[]');
    const updatedAll = allTxs.filter(t => t.id !== id);
    localStorage.setItem('agri_txs', JSON.stringify(updatedAll));
    loadDashboardData();
    showToast("Transaction deleted. (Local)");
  };

  const openTxModal = (tx = null) => {
    if (tx) {
      setEditingTx(tx);
      setTxFormType(tx.type);
    } else {
      setEditingTx(null);
      setTxFormType('Expense');
    }
    setShowAddTx(true);
  };

  const handleSaveLedger = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ledgerData = {
      name: formData.get('name'),
      type: formData.get('type')
    };

    const token = localStorage.getItem('token');
    
    if (token && token !== 'dummy-preview-token') {
        try {
            const method = editingLedger ? 'PUT' : 'POST';
            // FIXED API URLs
            const url = editingLedger ? `${import.meta.env.VITE_API_URL}/api/ledgers/${editingLedger.id}` : `${import.meta.env.VITE_API_URL}/api/ledgers`;
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(ledgerData)
            });
            
            if (res.ok) {
                showToast(`Ledger ${editingLedger ? 'updated' : 'created'} in database!`);
                setShowLedgerModal(false);
                setEditingLedger(null);
                loadDashboardData();
                return;
            }
        } catch (err) { console.error(err); }
    }

    ledgerData.id = editingLedger ? editingLedger.id : Date.now();
    ledgerData.user_id = user.id;
    const allLedgers = JSON.parse(localStorage.getItem('agri_ledgers') || '[]');

    if (editingLedger) {
      const updatedAll = allLedgers.map(l => l.id === editingLedger.id ? ledgerData : l);
      localStorage.setItem('agri_ledgers', JSON.stringify(updatedAll));
      showToast("Ledger updated! (Local)");
    } else {
      localStorage.setItem('agri_ledgers', JSON.stringify([...allLedgers, ledgerData]));
      showToast("New ledger created! (Local)");
    }

    loadDashboardData();
    setShowLedgerModal(false);
    setEditingLedger(null);
  };

  const deleteLedger = async (id) => {
    if(!window.confirm("Delete this custom ledger? (Existing transactions will keep its name)")) return;
    
    const token = localStorage.getItem('token');
    if (token && token !== 'dummy-preview-token') {
        try {
            // FIXED API URL
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ledgers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                showToast("Ledger deleted from database.");
                loadDashboardData();
                return;
            }
        } catch (err) { console.error(err); }
    }

    const allLedgers = JSON.parse(localStorage.getItem('agri_ledgers') || '[]');
    const updatedAll = allLedgers.filter(l => l.id !== id);
    localStorage.setItem('agri_ledgers', JSON.stringify(updatedAll));
    loadDashboardData();
    showToast("Ledger deleted. (Local)");
  };

  const openLedgerModal = (ledger = null) => {
    setEditingLedger(ledger);
    setShowLedgerModal(true);
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCrop = {
      name: formData.get('name'),
      season: formData.get('season'),
      status: 'Active'
    };

    const token = localStorage.getItem('token');
    if (token && token !== 'dummy-preview-token') {
        try {
            // FIXED API URL
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/crops`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(newCrop)
            });
            if (res.ok) {
                showToast("New crop successfully added to database!");
                setShowAddCrop(false);
                loadDashboardData();
                return;
            }
        } catch (err) { console.error(err); }
    }

    newCrop.id = Date.now();
    newCrop.user_id = user.id;
    const allCrops = JSON.parse(localStorage.getItem('agri_crops') || '[]');
    localStorage.setItem('agri_crops', JSON.stringify([...allCrops, newCrop]));
    loadDashboardData();
    setShowAddCrop(false);
    showToast("New crop successfully added! (Local)");
  };

  const deleteCrop = async (id) => {
    if(!window.confirm("Are you sure you want to delete this crop? All transactions linked to it will also be deleted.")) return;

    const token = localStorage.getItem('token');
    if (token && token !== 'dummy-preview-token') {
        try {
            // FIXED API URL
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/crops/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                showToast("Crop and associated transactions deleted from database.");
                loadDashboardData();
                return;
            }
        } catch (err) { console.error(err); }
    }

    const allCrops = JSON.parse(localStorage.getItem('agri_crops') || '[]');
    const updatedCrops = allCrops.filter(c => c.id !== id);
    localStorage.setItem('agri_crops', JSON.stringify(updatedCrops));

    const allTxs = JSON.parse(localStorage.getItem('agri_txs') || '[]');
    const updatedTxs = allTxs.filter(t => t.crop_id !== id);
    localStorage.setItem('agri_txs', JSON.stringify(updatedTxs));

    loadDashboardData();
    showToast("Crop and associated transactions deleted. (Local)");
  };

  const barColors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 'bg-yellow-500'];

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {notification && (
        <div className="absolute top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-down">
          <Leaf className="w-5 h-5 mr-2" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-green-800 text-white w-64 transform transition-transform duration-300 z-20 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block flex flex-col`}>
        <div className="p-6 flex items-center space-x-3 border-b border-green-700 shrink-0">
          <Leaf className="w-8 h-8" />
          <span className="text-2xl font-bold">AgriLedger</span>
          <button className="md:hidden ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </button>
          
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <Activity className="w-5 h-5" />
            <span>Analytics Dashboard</span>
          </button>

          <button onClick={() => setActiveTab('crops')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'crops' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <Tractor className="w-5 h-5" />
            <span>My Crops</span>
          </button>
          <button onClick={() => setActiveTab('ledgers')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'ledgers' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <BookOpen className="w-5 h-5" />
            <span>Custom Ledgers</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <PieChart className="w-5 h-5" />
            <span>Detailed Reports</span>
          </button>
          <button onClick={() => setActiveTab('detailed-view')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'detailed-view' || activeTab === 'ledger-transactions' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <Eye className="w-5 h-5" />
            <span>Detailed View</span>
          </button>
        </nav>
        <div className="p-4 border-t border-green-700 shrink-0">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 text-red-200 hover:bg-green-700 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden bg-white shadow p-4 flex items-center shrink-0">
           <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600">
             <Menu className="w-6 h-6" />
           </button>
           <span className="ml-4 text-xl font-bold text-green-800">AgriLedger</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
              
              <div className="flex space-x-2">
                {activeTab === 'ledgers' ? (
                  <button onClick={() => openLedgerModal()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Ledger Category</span>
                  </button>
                ) : (
                  <>
                    <button onClick={() => setShowAddCrop(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors">
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Add Crop</span>
                    </button>
                    <button onClick={() => openTxModal()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-sm transition-colors">
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Add Transaction</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><TrendingUp className="w-8 h-8"/></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.income)}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full"><TrendingDown className="w-8 h-8"/></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.expense)}</p>
                    </div>
                  </div>
                  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4`}>
                    <div className={`p-3 rounded-full ${stats.profit >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      <BarChart3 className="w-8 h-8"/>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Net Profit / Loss</p>
                      <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(stats.profit)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Landmark className="w-8 h-8"/></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Assets (Equipment, Land)</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.asset)}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><CreditCard className="w-8 h-8"/></div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Liabilities (Loans)</p>
                      <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.liability)}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${stats.netWorth >= 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'}`}>
                      <Shield className="w-8 h-8"/>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Net Worth</p>
                      <p className={`text-2xl font-bold ${stats.netWorth >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{formatCurrency(stats.netWorth)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                    <div className="flex space-x-2">
                       <button 
                         onClick={() => exportTransactionsToPDF(transactions, "Full Transaction History")} 
                         className="flex items-center text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                       >
                         <FileText className="w-3.5 h-3.5 mr-1.5" /> PDF
                       </button>
                       <button 
                         onClick={() => exportTransactionsToExcel(transactions, "Full_History")} 
                         className="flex items-center text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                       >
                         <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Excel
                       </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {transactions.map((tx, index) => {
                      const crop = crops.find(c => c.id === tx.crop_id);
                      return (
                        <div key={`tx-${tx.id}-${index}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 transition-colors gap-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${['Income', 'Asset'].includes(tx.type) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {['Income', 'Asset'].includes(tx.type) ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-gray-800">{crop ? crop.name : 'Unknown Crop'}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> {formatDate(tx.transaction_date)}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                                  tx.type === 'Income' ? 'bg-green-100 text-green-700' : 
                                  tx.type === 'Expense' ? 'bg-red-100 text-red-700' : 
                                  tx.type === 'Asset' ? 'bg-purple-100 text-purple-700' : 
                                  'bg-yellow-100 text-yellow-700'
                                }`}>{tx.type}</span>
                                <span className="flex items-center"><Tag className="w-3.5 h-3.5 mr-1"/> {tx.category}</span>
                              </div>
                              {tx.description && (
                                <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed border-l-2 border-gray-100 pl-3 py-1 bg-gray-50/50 rounded-r">
                                  {tx.description}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between w-full sm:w-auto space-x-6 pl-16 sm:pl-0 shrink-0">
                            <div className="text-left sm:text-right">
                              <span className={`block text-lg font-bold ${['Income', 'Asset'].includes(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                                {['Income', 'Asset'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                              </span>
                            </div>
                            <div className="flex space-x-1 shrink-0">
                              <button onClick={() => openTxModal(tx)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Edit className="w-4 h-4"/></button>
                              <button onClick={() => deleteTransaction(tx.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {transactions.length === 0 && (
                      <div className="p-12 text-center flex flex-col items-center">
                         <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-3">
                            <List className="w-8 h-8" />
                         </div>
                         <p className="text-gray-500 font-medium">No transactions recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VISUAL ANALYTICS DASHBOARD */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* Time Period Filter and Export */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Activity className="w-6 h-6"/></div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">Financial Overview</h2>
                      <p className="text-xs text-gray-500">Filter your analytics by timeframe</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={exportAnalyticsToExcel}
                      className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" /> Export Summary
                    </button>
                    <select 
                      value={analyticsPeriod}
                      onChange={(e) => setAnalyticsPeriod(e.target.value)}
                      className="border border-gray-300 rounded-lg shadow-sm py-2 px-4 focus:ring-green-500 focus:border-green-500 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer outline-none w-full sm:w-auto"
                    >
                      <option value="daily">Daily (Today)</option>
                      <option value="weekly">Weekly (Last 7 Days)</option>
                      <option value="monthly">Monthly (Last 30 Days)</option>
                      <option value="quarterly">Quarterly (Last 3 Months)</option>
                      <option value="halfyearly">Half-Yearly (Last 6 Months)</option>
                      <option value="annually">Annually (Last 12 Months)</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>

                {/* Analytics Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20"><DollarSign className="w-32 h-32" /></div>
                    <p className="text-green-100 font-medium mb-1 relative z-10">Net Operating Profit</p>
                    <h3 className="text-4xl font-extrabold relative z-10">{formatCurrency(analyticsStats.profit)}</h3>
                    <p className="text-sm text-green-100 mt-2 relative z-10">Based on selected timeframe</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-20"><Percent className="w-32 h-32" /></div>
                    <p className="text-blue-100 font-medium mb-1 relative z-10">Profit Margin</p>
                    <h3 className="text-4xl font-extrabold relative z-10">
                      {analyticsStats.income > 0 ? ((analyticsStats.profit / analyticsStats.income) * 100).toFixed(1) : 0}%
                    </h3>
                    <p className="text-sm text-blue-100 mt-2 relative z-10">Efficiency of your operations</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Filtered Cash Flow Bar Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <div className="mb-6 flex justify-between items-center shrink-0">
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">Cash Flow Trend</h2>
                        <p className="text-sm text-gray-500">Income vs Expense trend</p>
                      </div>
                      <div className="flex items-center space-x-3 text-xs font-medium">
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Income</div>
                        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Expense</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                      <div className="min-w-[400px] h-full flex flex-col">
                        {cashflowData.length > 0 ? (
                          <div className="flex-1 flex items-end justify-between space-x-2 border-b border-gray-200 pb-2 relative pt-8">
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 opacity-20">
                               <div className="w-full border-t border-dashed border-gray-400"></div>
                               <div className="w-full border-t border-dashed border-gray-400"></div>
                               <div className="w-full border-t border-dashed border-gray-400"></div>
                            </div>
                            {cashflowData.map(point => (
                              <div key={point.label} className="flex flex-col items-center flex-1 group relative h-full justify-end">
                                <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                  <p className="font-bold text-green-400">Inc: {formatCurrency(point.income)}</p>
                                  <p className="font-bold text-red-400">Exp: {formatCurrency(point.expense)}</p>
                                </div>
                                
                                <div className="flex items-end space-x-1 w-full justify-center h-[90%] relative z-0">
                                  <div className="bg-green-500 rounded-t-md w-full max-w-[24px] transition-all duration-300 hover:brightness-110" style={{ height: `${(point.income / maxCashflow) * 100}%`, minHeight: '4px' }}></div>
                                  <div className="bg-red-500 rounded-t-md w-full max-w-[24px] transition-all duration-300 hover:brightness-110" style={{ height: `${(point.expense / maxCashflow) * 100}%`, minHeight: '4px' }}></div>
                                </div>
                                
                                <span className="text-[10px] sm:text-xs font-medium text-gray-500 mt-3 truncate w-full text-center">{point.label}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-gray-400 italic">No transaction data available for this period.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Expense Breakdown Horizontal Bars */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <div className="mb-6 shrink-0">
                      <h2 className="text-lg font-bold text-gray-800">Expense Breakdown</h2>
                      <p className="text-sm text-gray-500">Where your money is going</p>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                      {expenseByCategory.length > 0 ? (
                        expenseByCategory.map((exp, i) => (
                          <div key={exp.name} className="group">
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{exp.name}</span>
                              <span className="text-gray-600 font-medium">{formatCurrency(exp.amount)} <span className="text-gray-400 text-xs ml-1">({exp.percentage.toFixed(1)}%)</span></span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                              <div className={`h-full rounded-full ${barColors[i % barColors.length]} transition-all duration-1000 ease-out`} style={{ width: `${exp.percentage}%` }}></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 italic">No expenses recorded yet.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom: Asset vs Liability Visualization */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <h2 className="text-lg font-bold text-gray-800 mb-2">Net Worth Distribution</h2>
                   <p className="text-sm text-gray-500 mb-6">Ratio of your Assets to your Liabilities.</p>
                   {stats.asset > 0 || stats.liability > 0 ? (
                     <div className="relative pt-4 pb-8">
                       <div className="flex h-8 rounded-xl overflow-hidden shadow-inner">
                         <div className="bg-purple-500 h-full flex items-center justify-start px-4 text-white font-bold text-sm transition-all duration-700" style={{ width: `${(stats.asset / (stats.asset + stats.liability)) * 100}%` }}>
                           {(stats.asset / (stats.asset + stats.liability) * 100).toFixed(0)}%
                         </div>
                         <div className="bg-yellow-500 h-full flex items-center justify-end px-4 text-white font-bold text-sm transition-all duration-700" style={{ width: `${(stats.liability / (stats.asset + stats.liability)) * 100}%` }}>
                           {(stats.liability / (stats.asset + stats.liability) * 100).toFixed(0)}%
                         </div>
                       </div>
                       <div className="flex justify-between mt-3 text-sm font-medium">
                         <div className="text-purple-700 flex items-center"><span className="w-3 h-3 rounded bg-purple-500 mr-2"></span> Assets ({formatCurrency(stats.asset)})</div>
                         <div className="text-yellow-700 flex items-center"><span className="w-3 h-3 rounded bg-yellow-500 mr-2"></span> Liabilities ({formatCurrency(stats.liability)})</div>
                       </div>
                     </div>
                   ) : (
                     <div className="py-6 text-center text-gray-400 italic bg-gray-50 rounded-lg">Record Assets and Liabilities to see your distribution.</div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'ledgers' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">Your Accounting Categories</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage the categories you use to classify your financial data.</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {ledgers.map((ledger, index) => (
                    <div key={`ledger-item-${ledger.id}-${index}`} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          ledger.type === 'Income' ? 'bg-green-100 text-green-600' : 
                          ledger.type === 'Expense' ? 'bg-red-100 text-red-600' : 
                          ledger.type === 'Asset' ? 'bg-purple-100 text-purple-600' : 
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {ledger.type === 'Income' && <TrendingUp className="w-6 h-6" />}
                          {ledger.type === 'Expense' && <TrendingDown className="w-6 h-6" />}
                          {ledger.type === 'Asset' && <Landmark className="w-6 h-6" />}
                          {ledger.type === 'Liability' && <CreditCard className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-gray-800">{ledger.name}</h4>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                            ledger.type === 'Income' ? 'bg-green-50 text-green-700 border border-green-100' : 
                            ledger.type === 'Expense' ? 'bg-red-50 text-red-700 border-red-100' : 
                            ledger.type === 'Asset' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            'bg-yellow-100 text-yellow-700 border border-yellow-100'
                          }`}>{ledger.type}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button onClick={() => openLedgerModal(ledger)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit Ledger"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => deleteLedger(ledger.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete Ledger"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                 <div className="flex justify-end space-x-3 mb-2">
                    <button 
                      onClick={() => {
                        if (!window.XLSX) { showToast("Library loading..."); return; }
                        const reportData = cropStats.map(c => ({
                          Crop: c.name,
                          Season: c.season,
                          Income: c.total_income,
                          Expense: c.total_expense,
                          NetProfit: Number(c.total_income) - Number(c.total_expense)
                        }));
                        const worksheet = window.XLSX.utils.json_to_sheet(reportData);
                        const workbook = window.XLSX.utils.book_new();
                        window.XLSX.utils.book_append_sheet(workbook, worksheet, "Performance");
                        window.XLSX.writeFile(workbook, "Crop_Performance.xlsx");
                        showToast("Report Exported");
                      }}
                      className="flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" /> Export Performance
                    </button>
                 </div>
                 {cropStats.map((crop, index) => {
                   const netProfit = Number(crop.total_income) - Number(crop.total_expense);
                   return (
                     <div key={`report-${crop.crop_id}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">{crop.name}</h2>
                            <span className="text-sm text-gray-500">{crop.season}</span>
                          </div>
                          <div className="text-right">
                             <p className="text-sm text-gray-500 font-medium">Crop Net Profit</p>
                             <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                               {formatCurrency(netProfit)}
                             </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div className="bg-gray-50 p-4 rounded-lg">
                             <p className="text-gray-500 mb-1">Total Crop Revenue</p>
                             <p className="text-lg font-bold text-gray-800">{formatCurrency(crop.total_income)}</p>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-lg">
                             <p className="text-gray-500 mb-1">Total Crop Expenses</p>
                             <p className="text-lg font-bold text-gray-800">{formatCurrency(crop.total_expense)}</p>
                           </div>
                        </div>
                     </div>
                   );
                 })}
                 {cropStats.length === 0 && <p className="text-gray-500">No reports available. Add some crops and transactions first.</p>}
              </div>
            )}

            {activeTab === 'detailed-view' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800">Detailed View: All Ledgers</h2>
                  <p className="text-sm text-gray-500 mt-1">Select a ledger card to view all its related transactions.</p>
                </div>
                {ledgers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ledgers.map((ledger, index) => (
                      <div 
                        key={`detailed-ledger-${ledger.id}-${index}`} 
                        onClick={() => { setActiveLedger(ledger); setActiveTab('ledger-transactions'); }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-green-400 transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors">{ledger.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                ${ledger.type === 'Income' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  ledger.type === 'Expense' ? 'bg-red-50 text-red-700 border-red-200' : 
                                  ledger.type === 'Asset' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                  'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                              {ledger.type}
                            </span>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium group-hover:text-green-600 transition-colors">
                          <List className="w-5 h-5 mr-2" /> 
                          <span>View Transactions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                    No ledgers found.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ledger-transactions' && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <button 
                      onClick={() => setActiveTab('detailed-view')} 
                      className="mr-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600"/>
                    </button>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">Transactions for {activeLedger?.name}</h1>
                      <p className="text-gray-500 text-sm mt-1">Export filtered data below.</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => exportTransactionsToPDF(transactions.filter(t => t.category === activeLedger?.name), `Ledger_${activeLedger?.name}`)} 
                      className="flex items-center bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium shadow-sm"
                    >
                      <FileText className="w-4 h-4 mr-2" /> PDF
                    </button>
                    <button 
                      onClick={() => exportTransactionsToExcel(transactions.filter(t => t.category === activeLedger?.name), `Ledger_${activeLedger?.name}`)} 
                      className="flex items-center bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors text-sm font-medium shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {transactions.filter(tx => tx.category === activeLedger?.name).map((tx, idx) => {
                      const crop = crops.find(c => c.id === tx.crop_id);
                      return (
                        <div key={`detailed-tx-${tx.id || idx}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 transition-colors gap-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${['Income', 'Asset'].includes(tx.type) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {['Income', 'Asset'].includes(tx.type) ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-gray-800">{crop ? crop.name : 'Unknown Crop'}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> {formatDate(tx.transaction_date)}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                                  tx.type === 'Income' ? 'bg-green-100 text-green-700' : 
                                  tx.type === 'Expense' ? 'bg-red-100 text-red-700' : 
                                  tx.type === 'Asset' ? 'bg-purple-100 text-purple-700' : 
                                  'bg-yellow-100 text-yellow-700'
                                }`}>{tx.type}</span>
                              </div>
                              {tx.description && (
                                <div className="mt-2 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed border-l-2 border-gray-100 pl-3 py-1 bg-gray-50/50 rounded-r">
                                  {tx.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto space-x-6 pl-16 sm:pl-0 shrink-0">
                            <div className="text-left sm:text-right">
                              <span className={`block text-lg font-bold ${['Income', 'Asset'].includes(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                                {['Income', 'Asset'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                              </span>
                            </div>
                            <div className="flex space-x-1 shrink-0">
                              <button onClick={() => openTxModal(tx)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Edit className="w-4 h-4"/></button>
                              <button onClick={() => deleteTransaction(tx.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'crops' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {crops.map((crop, index) => (
                   <div key={`crop-${crop.id}-${index}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-800">{crop.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${crop.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {crop.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{crop.season}</p>
                     </div>
                     <div className="flex justify-between items-center mt-6">
                       <button onClick={() => setActiveTab('reports')} className="text-green-600 font-medium hover:text-green-700 text-sm flex items-center">
                         View Financials <TrendingUp className="w-4 h-4 ml-1"/>
                       </button>
                       <button onClick={() => deleteCrop(crop.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors" title="Delete Crop">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   </div>
                ))}
                {crops.length === 0 && <p className="text-gray-500">No crops found.</p>}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: Add/Edit Transaction */}
      {showAddTx && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowAddTx(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{editingTx ? 'Edit Transaction' : 'Record Transaction'}</h2>
            
            {crops.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm mb-4">You need to add a crop before recording a transaction.</p>
                <button 
                  onClick={() => { setShowAddTx(false); setShowAddCrop(true); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Create Your First Crop
                </button>
              </div>
            ) : ledgers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm mb-4">You need to create an accounting ledger category before recording a transaction.</p>
                <button 
                  onClick={() => { setShowAddTx(false); setShowLedgerModal(true); }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                  Create a Ledger
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Crop</label>
                  <select name="cropId" defaultValue={editingTx?.crop_id} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    {crops.map((c, idx) => <option key={`opt-crop-${c.id || idx}`} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select 
                      name="type" 
                      value={txFormType} 
                      onChange={(e) => setTxFormType(e.target.value)} 
                      required 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                      <option value="Asset">Asset</option>
                      <option value="Liability">Liability</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" required defaultValue={editingTx ? editingTx.transaction_date : new Date().toISOString().split('T')[0]} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ledger Category</label>
                  <select name="category" defaultValue={editingTx?.category} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    {ledgers.filter(l => l.type === txFormType).map((l, idx) => (
                      <option key={`opt-ledger-${l.id || idx}`} value={l.name}>{l.name}</option>
                    ))}
                    {ledgers.filter(l => l.type === txFormType).length === 0 && (
                      <option value="" disabled>No ledgers found for this type. Create one first!</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input type="number" name="amount" min="0" step="0.01" required defaultValue={editingTx?.amount} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description / Notes</label>
                  <textarea name="description" rows="2" defaultValue={editingTx?.description} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500 sm:text-sm"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={ledgers.filter(l => l.type === txFormType).length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors mt-4"
                >
                  {ledgers.filter(l => l.type === txFormType).length === 0 ? 'Create a Ledger First' : (editingTx ? 'Update Transaction' : 'Save Record')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Custom Ledger */}
      {showLedgerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowLedgerModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">{editingLedger ? 'Edit Ledger' : 'Add New Ledger'}</h2>
            <form onSubmit={handleSaveLedger} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ledger Name</label>
                <input type="text" name="name" placeholder="e.g. Irrigation Fuel" required defaultValue={editingLedger?.name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Accounting Type</label>
                <select name="type" required defaultValue={editingLedger?.type || 'Expense'} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors mt-4">
                {editingLedger ? 'Update Ledger' : 'Save Ledger'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Crop */}
      {showAddCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowAddCrop(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Crop</h2>
            <form onSubmit={handleAddCrop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                <input type="text" name="name" placeholder="e.g. Wheat Field A" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Season/Year</label>
                <input type="text" name="season" placeholder="e.g. Rabi 2025" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors mt-4">
                Save Crop
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}