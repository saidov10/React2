import React from 'react';
import { 
  Users, 
  Search, 
  SlidersHorizontal,
  Plus,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function DashboardDark() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 lg:space-y-8">
      
      {/* ЗАГОЛОВОК СТРАНИЦЫ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-[#f8fafc] tracking-tight">Хулосаи имрӯз</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-[#475569] mt-0.5">Ҳисоботи кӯтоҳи молиявии шумо барои имрӯз.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#cbd5e1] shadow-sm w-full sm:w-auto justify-center">
            <Calendar size={14} className="text-slate-400 dark:text-[#475569]" />
            Имрӯз: 24 Май, 2024
          </div>
          <button className="flex items-center justify-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition whitespace-nowrap w-full sm:w-auto">
            <Plus size={16} /> Қарзи нав
          </button>
        </div>
      </div>

      {/* МЕТРИКИ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Мизоҷони фаъол */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#1e293b] text-[#3b82f6]">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#065f46]/10 dark:bg-[#065f46]/30 text-emerald-600 dark:text-[#34d399] border border-emerald-500/20 dark:border-[#047857]/40">
              +12 нав
            </span>
          </div>
          <div className="mt-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#475569] uppercase">Мизоҷони фаъол</span>
            <span className="text-3xl font-black text-slate-800 dark:text-[#f8fafc] tracking-tight mt-0.5 block">348</span>
          </div>
        </div>

        {/* Сатҳи баргардонӣ */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#1e293b] text-[#10b981]">
              <CheckCircle size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-[#1e3a8a]/40 text-blue-600 dark:text-[#60a5fa] border border-blue-100 dark:border-[#1d4ed8]/30">
              Олӣ
            </span>
          </div>
          <div className="mt-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#475569] uppercase">Сатҳи баргардонӣ</span>
            <span className="text-3xl font-black text-slate-800 dark:text-[#f8fafc] tracking-tight mt-0.5 block">84.5%</span>
          </div>
        </div>

        {/* Пардохтҳои таъхиршуда */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#1e293b] text-[#ef4444]">
              <AlertTriangle size={20} />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 dark:bg-[#7f1d1d]/30 text-red-600 dark:text-[#f87171] border border-red-100 dark:border-[#991b1b]/30">
              -2.1%
            </span>
          </div>
          <div className="mt-4">
            <span className="block text-[10px] font-bold tracking-wider text-slate-400 dark:text-[#475569] uppercase">Пардохтҳои таъхиршуда</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-slate-800 dark:text-[#f8fafc] tracking-tight">12,400</span>
              <span className="text-sm font-bold text-slate-400 dark:text-[#475569] uppercase">смн</span>
            </div>
          </div>
        </div>

      </div>

      {/* ГРАФИК И ВИДЖЕТ ШАБАКА */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Столбчатый график */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[290px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-800 dark:text-[#f8fafc]">Даромади моҳона</span>
            <button className="flex items-center gap-1 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] text-[11px] font-bold px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-[#cbd5e1]">
              Соли 2024 <ChevronDown size={12} />
            </button>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-3 pt-6 px-2">
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-slate-100 dark:bg-[#1e293b]/40 rounded-lg h-24 group-hover:bg-[#3b82f6]/20 transition duration-300" />
              <span className="text-[10px] font-semibold text-slate-400 dark:text-[#475569]">Мар</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-slate-100 dark:bg-[#1e293b]/40 rounded-lg h-36 group-hover:bg-[#3b82f6]/20 transition duration-300" />
              <span className="text-[10px] font-semibold text-slate-400 dark:text-[#475569]">Апр</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-[#2563eb] rounded-lg h-48 shadow-md shadow-blue-600/20" />
              <span className="text-[10px] font-bold text-[#3b82f6]">Май</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-slate-100 dark:bg-[#1e293b]/40 rounded-lg h-16 group-hover:bg-[#3b82f6]/20 transition duration-300" />
              <span className="text-[10px] font-semibold text-slate-400 dark:text-[#475569]">Июн</span>
            </div>
          </div>
        </div>

        {/* Виджет Шабакаи қарз */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[290px]">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-[#f8fafc]">Шабакаи қарз</h3>
            <p className="text-xs text-slate-400 dark:text-[#475569] mt-0.5">Пайвастшавии мизоҷон ва оптимизатсия.</p>
          </div>

          <div className="my-6 p-4 border border-dashed border-slate-200 dark:border-[#1e293b] rounded-xl bg-slate-50 dark:bg-[#0b0f19]/40 flex flex-col items-center justify-center text-center py-8">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-[#3b82f6] flex items-center justify-center mb-2 animate-pulse">
              <TrendingUp size={18} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-[#cbd5e1]">Маълумот дар ҳамоҳангӣ</span>
            <span className="text-[10px] text-slate-400 dark:text-[#475569] max-w-[170px] mt-0.5">Шабакаи автоматии қарзҳо устувор кор мекунад.</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-[#475569] uppercase tracking-wider">
              <span>Оптимизатсияи ҷараён</span>
              <span className="text-[#3b82f6] font-extrabold">68%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-[#1e293b] rounded-full overflow-hidden">
              <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
        </div>

      </div>

      {/* ТАБЛИЦА СВЕЖИХ ТРАНЗАКЦИЙ */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-[#1e293b] rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#475569]" size={15} />
            <input 
              type="text" 
              placeholder="Ҷустуҷӯи мизоҷ..." 
              className="w-full bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-[#3b82f6] transition text-slate-800 dark:text-[#f8fafc] placeholder-slate-400 dark:placeholder-[#475569]"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-slate-200 dark:border-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#cbd5e1] transition">
            <SlidersHorizontal size={14} /> Филтр
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1e293b] text-[10px] font-bold text-slate-400 dark:text-[#475569] uppercase tracking-wider bg-slate-50 dark:bg-[#1e293b]/20">
                <th className="py-4 px-6">Мизоҷ</th>
                <th className="py-4 px-6">Сана</th>
                <th className="py-4 px-6">Маблағ</th>
                <th className="py-4 px-6">Статус</th>
                <th className="py-4 px-6 text-center">Амал</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1e293b] text-xs font-medium text-slate-600 dark:text-[#cbd5e1]">
              
              {/* Строка 1 */}
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1e293b]/10 transition">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1d4ed8]/10 dark:bg-[#1d4ed8]/20 text-blue-600 dark:text-[#60a5fa] font-bold text-[11px] flex items-center justify-center">РД</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-[#f8fafc]">Раҷабов Давлат</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#475569]">ID: #12330</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6 text-slate-400 dark:text-[#64748b]">23 Май, 2024</td>
                <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-[#f8fafc]">4,500 смн</td>
                <td className="py-3.5 px-6">
                  <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-[#065f46]/30 text-emerald-600 dark:text-[#34d399] border border-emerald-500/20 dark:border-[#047857]/40">
                    Қабул шуд
                  </span>
                </td>
                <td className="py-3.5 px-6 text-center">
                  <button className="p-1 text-slate-400 dark:text-[#475569] hover:text-slate-800 dark:hover:text-[#f8fafc] rounded-lg transition"><MoreHorizontal size={16} /></button>
                </td>
              </tr>

              {/* Строка 2 */}
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1e293b]/10 transition">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#b45309]/10 dark:bg-[#b45309]/20 text-amber-600 dark:text-[#fbbf24] font-bold text-[11px] flex items-center justify-center">ХЗ</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-[#f8fafc]">Хайруллоев Зафар</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#475569]">ID: #99211</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6 text-slate-400 dark:text-[#64748b]">22 Май, 2024</td>
                <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-[#f8fafc]">12,000 смн</td>
                <td className="py-3.5 px-6">
                  <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-50 dark:bg-[#78350f]/40 text-amber-600 dark:text-[#fbbf24] border border-amber-500/20 dark:border-[#b45309]/30">
                    Дар интизор
                  </span>
                </td>
                <td className="py-3.5 px-6 text-center">
                  <button className="p-1 text-slate-400 dark:text-[#475569] hover:text-slate-800 dark:hover:text-[#f8fafc] rounded-lg transition"><MoreHorizontal size={16} /></button>
                </td>
              </tr>

              {/* Строка 3 */}
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1e293b]/10 transition">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#991b1b]/10 dark:bg-[#991b1b]/20 text-red-600 dark:text-[#f87171] font-bold text-[11px] flex items-center justify-center">МК</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-[#f8fafc]">Маҳмудов Карим</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#475569]">ID: #88401</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-6 text-slate-400 dark:text-[#64748b]">21 Май, 2024</td>
                <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-[#f8fafc]">800 смн</td>
                <td className="py-3.5 px-6">
                  <span className="inline-flex px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-red-50 dark:bg-[#7f1d1d]/40 text-red-600 dark:text-[#f87171] border border-red-500/20 dark:border-[#991b1b]/30">
                    Таъхир
                  </span>
                </td>
                <td className="py-3.5 px-6 text-center">
                  <button className="p-1 text-slate-400 dark:text-[#475569] hover:text-slate-800 dark:hover:text-[#f8fafc] rounded-lg transition"><MoreHorizontal size={16} /></button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-[#1e293b]/10 border-t border-slate-200 dark:border-[#1e293b] text-center">
          <a href="#" className="text-xs font-bold text-[#3b82f6] hover:text-[#60a5fa] transition">
            Ҳамаи транзаксияҳоро бинед
          </a>
        </div>

      </div>

    </div>
  );
}