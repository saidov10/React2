import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Search, 
  SlidersHorizontal,
  Plus,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Trash2,
  DollarSign,
  Folder,
  X,
  TrendingUp,
  Percent
} from 'lucide-react';
import { toast } from 'sonner';

interface Debt {
  id: string;
  name: string;
  amount: number;
  paid: number;
  type: 'they_owe_me' | 'i_owe';
  dueDate: string;
  folder: string;
}

const INITIAL_DEBTS: Debt[] = [
  { id: '1', name: 'Алишер Раҳимов', amount: 5000, paid: 2500, type: 'they_owe_me', dueDate: '2026-06-25', folder: 'Бизнес' },
  { id: '2', name: 'Мадина Саидова', amount: 1200, paid: 1200, type: 'they_owe_me', dueDate: '2026-05-15', folder: 'Хусусӣ' },
  { id: '3', name: 'Фирӯз Назаров', amount: 3000, paid: 0, type: 'i_owe', dueDate: '2026-07-10', folder: 'Бизнес' },
  { id: '4', name: 'Сомон Каримов', amount: 800, paid: 200, type: 'they_owe_me', dueDate: '2024-04-10', folder: 'Дигар' },
];

export default function Debts() {
  const { t } = useTranslation();
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Sorting state
  const [sortField, setSortField] = useState<'date' | 'amount' | null>('date');
  const [sortAsc, setSortAsc] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payModalMode, setPayModalMode] = useState<'increase' | 'decrease'>('decrease');
  const [isQuickPayDropdownOpen, setIsQuickPayDropdownOpen] = useState(false);

  // Form states - Add Debt
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPaid, setNewPaid] = useState('');
  const [newType, setNewType] = useState<'they_owe_me' | 'i_owe'>('they_owe_me');
  const [newFolder, setNewFolder] = useState('Бизнес');
  const [newDueDate, setNewDueDate] = useState('');

  
  const [selectedDebtId, setSelectedDebtId] = useState('');
  const [payAmount, setPayAmount] = useState('');

  
  const folders = useMemo(() => {
    const set = new Set(debts.map(d => d.folder));
    return ['all', ...Array.from(set)];
  }, [debts]);

  // Statistics calculation
  const stats = useMemo(() => {
    let theyOweTotal = 0;
    let iOweTotal = 0;

    debts.forEach(d => {
      const remaining = d.amount - d.paid;
      if (d.type === 'they_owe_me') {
        theyOweTotal += remaining;
      } else {
        iOweTotal += remaining;
      }
    });

    return {
      total: theyOweTotal - iOweTotal,
      theyOwe: theyOweTotal,
      iOwe: iOweTotal
    };
  }, [debts]);

  // Filtered & Sorted Debts
  const filteredDebts = useMemo(() => {
    let result = debts.filter(d => {
      const matchQuery = d.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFolder = selectedFolder === 'all' || d.folder === selectedFolder;
      const matchType = selectedType === 'all' || d.type === selectedType;
      return matchQuery && matchFolder && matchType;
    });

    if (sortField) {
      result.sort((a, b) => {
        if (sortField === 'date') {
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          return sortAsc ? dateA - dateB : dateB - dateA;
        } else {
          const remA = a.amount - a.paid;
          const remB = b.amount - b.paid;
          return sortAsc ? remA - remB : remB - remA;
        }
      });
    }

    return result;
  }, [debts, searchQuery, selectedFolder, selectedType, sortField, sortAsc]);

  // Add Debt submit handler
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAmount) {
      toast.error(t('debts.validationError', 'Please fill in all required fields.'));
      return;
    }

    const amt = parseFloat(newAmount);
    const pd = newPaid ? parseFloat(newPaid) : 0;

    if (isNaN(amt) || amt <= 0 || isNaN(pd) || pd < 0) {
      toast.error(t('debts.invalidNumberError', 'Please enter valid amounts.'));
      return;
    }

    if (pd > amt) {
      toast.error(t('debts.paidExcessError', 'Paid amount cannot exceed total debt.'));
      return;
    }

    const newDebt: Debt = {
      id: Date.now().toString(),
      name: newName,
      amount: amt,
      paid: pd,
      type: newType,
      folder: newFolder,
      dueDate: newDueDate || new Date().toISOString().split('T')[0]
    };

    setDebts([newDebt, ...debts]);
    setIsAddModalOpen(false);
    toast.success(t('debts.addSuccess', 'Debt successfully recorded! 🎉'));
    
    // Reset form
    setNewName('');
    setNewAmount('');
    setNewPaid('');
    setNewType('they_owe_me');
    setNewFolder('Бизнес');
    setNewDueDate('');
  };

  // Quick Payment submit handler
  const handleQuickPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtId || !payAmount) {
      toast.error(t('debts.validationError', 'Please select a debt and amount.'));
      return;
    }

    const amountToApply = parseFloat(payAmount);
    if (isNaN(amountToApply) || amountToApply <= 0) {
      toast.error(t('debts.invalidAmount', 'Please enter a valid payment amount.'));
      return;
    }

    const targetDebt = debts.find(d => d.id === selectedDebtId);
    if (!targetDebt) return;

    if (payModalMode === 'decrease') {
      const maxRemaining = targetDebt.amount - targetDebt.paid;
      if (amountToApply > maxRemaining) {
        toast.error(t('debts.paymentExcess', 'Amount exceeds the remaining debt.'));
        return;
      }

      setDebts(debts.map(d => d.id === selectedDebtId ? { ...d, paid: d.paid + amountToApply } : d));
      toast.success(t('debts.paymentRecorded', 'Payment recorded successfully! 💸'));
    } else {
      setDebts(debts.map(d => d.id === selectedDebtId ? { ...d, amount: d.amount + amountToApply } : d));
      toast.success(t('debts.debtIncreased', 'Debt amount increased successfully! 📈'));
    }

    setIsPayModalOpen(false);
    setSelectedDebtId('');
    setPayAmount('');
  };

  // Delete Debt handler
  const handleDeleteDebt = (id: string) => {
    if (confirm(t('debts.deleteConfirm', 'Are you sure you want to delete this record?'))) {
      setDebts(debts.filter(d => d.id !== id));
      toast.success(t('debts.deleteSuccess', 'Record successfully deleted.'));
    }
  };

  // Mock export handler
  const handleExport = () => {
    toast.success(t('debts.exportToast', 'Data exported to TJS_Debts.xlsx successfully! 📥'));
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 lg:space-y-8 pb-24">
      
      {/* ── HEADER & ACTIONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('pages.debts.title', 'Қарзҳо')}
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-[#475569] mt-1">
            {t('pages.debts.description', 'Идоракунӣ ва назорати қарзҳои фаъоли шумо.')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-[#cbd5e1] border border-slate-200 dark:border-[#334155] text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition w-full sm:w-auto cursor-pointer"
          >
            <Download size={14} /> {t('debts.export', 'Содирот')}
          </button>

          {/* Quick Payment Button with Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setIsQuickPayDropdownOpen(!isQuickPayDropdownOpen)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition w-full sm:w-auto cursor-pointer"
            >
              <DollarSign size={14} /> {t('debts.quickPayment', 'Пардохти зуд')} <ChevronDown size={12} />
            </button>

            {isQuickPayDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsQuickPayDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1c2233] border border-slate-200 dark:border-[#2a3347] rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  <button
                    onClick={() => {
                      setPayModalMode('increase');
                      setIsPayModalOpen(true);
                      setIsQuickPayDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#cbd5e1] hover:bg-slate-50 dark:hover:bg-[#25304a] text-left transition"
                  >
                    <ArrowUpRight size={14} className="text-emerald-500" />
                    <span>{t('debts.increase', 'Зиёдшавӣ')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPayModalMode('decrease');
                      setIsPayModalOpen(true);
                      setIsQuickPayDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#cbd5e1] hover:bg-slate-50 dark:hover:bg-[#25304a] text-left transition"
                  >
                    <ArrowDownLeft size={14} className="text-rose-500" />
                    <span>{t('debts.decrease', 'Камшавӣ')}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── METRICS WIDGETS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Metric Card */}
        <div className={`p-6 rounded-2xl bg-white dark:bg-[#0f172a] border transition-all duration-300 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-md ${
          stats.total >= 0 
            ? 'border-emerald-500/30 dark:border-emerald-500/20' 
            : 'border-rose-500/30 dark:border-rose-500/20'
        }`}>
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${
              stats.total >= 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              <Wallet size={20} />
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
              stats.total >= 0 
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300' 
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-300'
            }`}>
              {stats.total >= 0 ? t('debts.positiveStatus', 'Мусбат') : t('debts.negativeStatus', 'Манфӣ')}
            </span>
          </div>
          <div className="mt-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#475569] uppercase">
              {t('debts.totalBalance', 'Ҳамагӣ')}
            </span>
            <span className={`text-3xl font-black tracking-tight mt-0.5 block ${
              stats.total >= 0 ? 'text-slate-800 dark:text-emerald-400' : 'text-slate-800 dark:text-rose-400'
            }`}>
              {stats.total.toLocaleString()} <span className="text-xs font-bold uppercase">TJS</span>
            </span>
          </div>
        </div>

        {/* They Owe Me Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={20} />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">
              {debts.filter(d => d.type === 'they_owe_me').length} {t('debts.activeCount', 'қарз')}
            </span>
          </div>
          <div className="mt-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#475569] uppercase">
              {t('debts.theyOweMe', 'Аз ман қарздоранд')}
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-[#f8fafc] tracking-tight mt-0.5 block">
              {stats.theyOwe.toLocaleString()} <span className="text-xs font-bold uppercase text-slate-400">TJS</span>
            </span>
          </div>
        </div>

        {/* I Owe Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] hover:border-rose-500/30 dark:hover:border-rose-500/20 transition-all duration-300 shadow-sm flex flex-col justify-between min-h-[130px] hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <ArrowDownLeft size={20} />
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30">
              {debts.filter(d => d.type === 'i_owe').length} {t('debts.activeCount', 'қарз')}
            </span>
          </div>
          <div className="mt-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#475569] uppercase">
              {t('debts.iOwe', 'Ман қарздорам')}
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-[#f8fafc] tracking-tight mt-0.5 block">
              {stats.iOwe.toLocaleString()} <span className="text-xs font-bold uppercase text-slate-400">TJS</span>
            </span>
          </div>
        </div>

      </div>

      {/* ── FILTERING & CONTROLS ── */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#475569]" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('debts.searchPlaceholder', 'Ҷустуҷӯ бо ном...')} 
            className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-blue-500 transition text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Dropdowns & Sorts */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Folders select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-xl py-2.5 px-4 pr-10 text-xs font-semibold focus:outline-none focus:border-blue-500 transition text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              <option value="all">{t('debts.allFolders', 'Ҳамаи ҷузвдонҳо')}</option>
              {folders.filter(f => f !== 'all').map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Type select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-xl py-2.5 px-4 pr-10 text-xs font-semibold focus:outline-none focus:border-blue-500 transition text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              <option value="all">{t('debts.allTypes', 'Ҳамаи намудҳо')}</option>
              <option value="they_owe_me">{t('debts.theyOweMeFilter', 'Мизоҷони қарздор')}</option>
              <option value="i_owe">{t('debts.iOweFilter', 'Қарзҳои ман')}</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 border border-slate-200 dark:border-[#1e293b] p-1.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19]">
            <button
              onClick={() => {
                if (sortField === 'date') {
                  setSortAsc(!sortAsc);
                } else {
                  setSortField('date');
                  setSortAsc(true);
                }
              }}
              title={t('debts.sortByDate', 'Мураттабсозӣ бо сана')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                sortField === 'date' 
                  ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <Calendar size={14} />
            </button>
            <button
              onClick={() => {
                if (sortField === 'amount') {
                  setSortAsc(!sortAsc);
                } else {
                  setSortField('amount');
                  setSortAsc(false);
                }
              }}
              title={t('debts.sortByAmount', 'Мураттабсозӣ бо маблағ')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                sortField === 'amount' 
                  ? 'bg-white dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <TrendingUp size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* ── TABLE / LIST VIEW ── */}
      {filteredDebts.length === 0 ? (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1e293b] text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
            <SlidersHorizontal size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            {t('debts.emptyTitle', 'Қарзҳо ёфт нашуданд')}
          </h3>
          <p className="text-xs text-slate-400 dark:text-[#475569] max-w-[240px] mt-1">
            {t('debts.emptyDesc', 'Ягон сабти қарз ба шартҳои ҷустуҷӯ мувофиқат накард.')}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Tabular View */}
          <div className="hidden md:block bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#1e293b] text-[10px] font-bold text-slate-400 dark:text-[#475569] uppercase tracking-wider bg-slate-50/50 dark:bg-[#1e293b]/20">
                    <th className="py-4 px-6">{t('debts.colName', 'НОМИ ПУРРА')}</th>
                    <th className="py-4 px-6">{t('debts.colAmount', 'МАБЛАҒ')}</th>
                    <th className="py-4 px-6">{t('debts.colProgress', 'ПЕШРАФТ')}</th>
                    <th className="py-4 px-6">{t('debts.colDate', 'САНАИ ПАРДОХТ')}</th>
                    <th className="py-4 px-6 text-center">{t('debts.colActions', 'АМАЛ')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1e293b] text-xs font-semibold text-slate-600 dark:text-[#cbd5e1]">
                  {filteredDebts.map(d => {
                    const progress = Math.min(100, Math.max(0, (d.paid / d.amount) * 100));
                    const isOverdue = new Date(d.dueDate) < new Date() && d.paid < d.amount;
                    const nameInitials = d.name.split(' ').map(n => n[0]).join('').slice(0, 2);

                    return (
                      <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-[#1e293b]/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full font-bold text-[11px] flex items-center justify-center shadow-sm select-none ${
                              d.type === 'they_owe_me' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}>
                              {nameInitials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 dark:text-white text-sm">{d.name}</span>
                              <span className="text-[10px] text-slate-400 dark:text-[#475569] flex items-center gap-1.5 mt-0.5">
                                <Folder size={10} /> {d.folder}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">
                              {d.amount.toLocaleString()} <span className="text-[10px] text-slate-400">TJS</span>
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-[#475569] mt-0.5">
                              {t('debts.remaining', 'Боқӣ')}: {(d.amount - d.paid).toLocaleString()} TJS
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 min-w-[150px]">
                          <div className="space-y-1.5 max-w-[180px]">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                              <span>{progress.toFixed(0)}% {t('debts.paidPercent', 'пардохт')}</span>
                              <span>{d.paid.toLocaleString()} / {d.amount.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-[#1e293b] rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  d.type === 'they_owe_me' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            <span className={isOverdue ? 'text-rose-500 font-bold' : ''}>{d.dueDate}</span>
                            {isOverdue && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100 dark:border-rose-900/30">
                                <AlertTriangle size={10} /> {t('debts.overdueBadge', 'Таъхир')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => {
                                setSelectedDebtId(d.id);
                                setPayModalMode('decrease');
                                setIsPayModalOpen(true);
                              }}
                              title={t('debts.payBtn', 'Сабти пардохт')}
                              className="p-2 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                            >
                              <DollarSign size={15} />
                            </button>
                            <button 
                              onClick={() => handleDeleteDebt(d.id)}
                              title={t('debts.deleteBtn', 'Нест кардан')}
                              className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredDebts.map(d => {
              const progress = Math.min(100, Math.max(0, (d.paid / d.amount) * 100));
              const isOverdue = new Date(d.dueDate) < new Date() && d.paid < d.amount;
              const nameInitials = d.name.split(' ').map(n => n[0]).join('').slice(0, 2);

              return (
                <div key={d.id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-5 shadow-sm space-y-4">
                  
                  {/* Avatar & Title Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full font-bold text-[11px] flex items-center justify-center shadow-sm select-none ${
                        d.type === 'they_owe_me' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {nameInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-white text-sm">{d.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-[#475569] flex items-center gap-1.5">
                          <Folder size={10} /> {d.folder}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      d.type === 'they_owe_me' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-100 dark:border-rose-900/30'
                    }`}>
                      {d.type === 'they_owe_me' ? t('debts.theyOweMeBadge', 'Аз ман') : t('debts.iOweBadge', 'Ман')}
                    </span>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-[#1e293b] py-3">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">{t('debts.totalAmount', 'МАБЛАҒ')}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {d.amount.toLocaleString()} TJS
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">{t('debts.remaining', 'БОҚӢ')}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">
                        {(d.amount - d.paid).toLocaleString()} TJS
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>{progress.toFixed(0)}% {t('debts.paidPercent', 'пардохт')}</span>
                      <span>{d.paid.toLocaleString()} / {d.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-[#1e293b] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          d.type === 'they_owe_me' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={13} />
                      <span className={isOverdue ? 'text-rose-500 font-bold' : ''}>{d.dueDate}</span>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100 dark:border-rose-900/30">
                          {t('debts.overdueBadge', 'Таъхир')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedDebtId(d.id);
                          setPayModalMode('decrease');
                          setIsPayModalOpen(true);
                        }}
                        className="flex items-center gap-1 bg-slate-50 dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-[#cbd5e1] border border-slate-200 dark:border-[#334155] text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer"
                      >
                        <DollarSign size={12} /> {t('debts.pay', 'Пардохт')}
                      </button>
                      <button
                        onClick={() => handleDeleteDebt(d.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── FLOATING ACTION BUTTON (FAB) ── */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 z-40 cursor-pointer"
      >
        <Plus size={24} />
      </button>

      {/* ── ADD DEBT MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1c2233] border border-slate-200 dark:border-[#2a3347] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="text-blue-500" size={20} />
                {t('debts.addNewDebt', 'Иловаи қарзи нав')}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDebt} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {t('signup.fullName', 'Номи пурра')}*
                </label>
                <input 
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('signup.fullNamePlaceholder', 'Номи пурраро ворид кунед')}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Amount & Paid fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {t('debts.amount', 'Маблағ')} (TJS)*
                  </label>
                  <input 
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {t('debts.paidAmount', 'Пардохтшуда')} (TJS)
                  </label>
                  <input 
                    type="number"
                    value={newPaid}
                    onChange={(e) => setNewPaid(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Folder & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {t('debts.folder', 'Ҷузвдон')}
                  </label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Бизнес">Бизнес</option>
                    <option value="Хусусӣ">Хусусӣ</option>
                    <option value="Оила">Оила</option>
                    <option value="Дигар">Дигар</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {t('debts.type', 'Намуд')}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'they_owe_me' | 'i_owe')}
                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="they_owe_me">{t('debts.theyOweMeOption', 'Ба ман месупоранд')}</option>
                    <option value="i_owe">{t('debts.iOweOption', 'Ман месупорам')}</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {t('debts.dueDate', 'Санаи пардохт')}
                </label>
                <input 
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a3347] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  {t('debts.cancel', 'Бекор кардан')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/15 transition cursor-pointer"
                >
                  {t('debts.save', 'Сабт кардан')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── QUICK PAYMENT MODAL ── */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPayModalOpen(false)} />
          <div className="relative bg-white dark:bg-[#1c2233] border border-slate-200 dark:border-[#2a3347] rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 z-50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="text-blue-500" size={20} />
                {t('debts.quickPayment', 'Пардохти зуд')} 
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  payModalMode === 'increase' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30' 
                    : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30'
                }`}>
                  {payModalMode === 'increase' ? t('debts.increase', 'Зиёдшавӣ') : t('debts.decrease', 'Камшавӣ')}
                </span>
              </h3>
              <button 
                onClick={() => setIsPayModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickPayment} className="space-y-4">
              
              {/* Select Debt */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {t('debts.selectDebtLabel', 'Қарзро интихоб кунед')}*
                </label>
                <select
                  required
                  value={selectedDebtId}
                  onChange={(e) => setSelectedDebtId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">-- {t('debts.selectDebtPlaceholder', 'Қарзро интихоб кунед')} --</option>
                  {debts.map(d => {
                    const remaining = d.amount - d.paid;
                    const typeLabel = d.type === 'they_owe_me' ? 'ба ман' : 'ман ба ӯ';
                    return (
                      <option key={d.id} value={d.id}>
                        {d.name} ({remaining.toLocaleString()} TJS - {typeLabel})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {t('debts.amount', 'Маблағ')} (TJS)*
                </label>
                <input 
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#2a3347] rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2a3347] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  {t('debts.cancel', 'Бекор кардан')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/15 transition cursor-pointer"
                >
                  {payModalMode === 'increase' 
                    ? t('debts.addDebtAmount', 'Илова кардани қарз') 
                    : t('debts.addPayment', 'Иловаи пардохт')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
