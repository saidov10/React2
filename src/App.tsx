import React from 'react';
import { useSetAtom } from 'jotai';
import { isModalOpenAtom, editingUserAtom } from './store/userAtoms';
import { UserModal } from './components/UserModal';
import { useSyncActions } from './store/syncActions';
import { Users, UserPlus, Trash2, Edit3, ShieldCheck, ShieldAlert } from 'lucide-react';

function App() {
  const { allUsers, handleGlobalDelete } = useSyncActions();
  const setIsOpen = useSetAtom(isModalOpenAtom);
  const setEditingUser = useSetAtom(editingUserAtom);

  const handleAdd = () => {
    setEditingUser(null);
    setIsOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Multi-Store Hub
              </h1>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <UserPlus size={18} />
              Add Member
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Jotai Store', count: allUsers.filter(u => u.source === 'Jotai').length, color: 'text-blue-600' },
            { label: 'Redux Store', count: allUsers.filter(u => u.source === 'Redux').length, color: 'text-purple-600' },
            { label: 'Zustand Store', count: allUsers.filter(u => u.source === 'Zustand').length, color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
              </div>
              <div className="h-12 w-1 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-lg text-slate-700">Unified Member Directory</h2>
            <p className="text-slate-500 text-sm">Synchronized across 3 state management systems</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Member Info</th>
                  <th className="px-6 py-4">Source Engine</th>
                  <th className="px-6 py-4 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <tr key={`${user.source}-${user.id}`} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        {user.status ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <ShieldCheck size={14} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            <ShieldAlert size={14} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.name}</span>
                          <span className="text-xs text-slate-400 font-mono">ID: #{user.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${
                          user.source === 'Jotai' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          user.source === 'Redux' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                          'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                          {user.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleGlobalDelete(user.id)}
                            className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={48} className="text-slate-200" />
                        <p className="text-slate-400 font-medium">No members found in any store.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <UserModal />
    </div>
  );
}

export default App;
