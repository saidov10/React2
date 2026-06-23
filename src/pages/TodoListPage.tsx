import { useState } from 'react';
import { useGetTodosQuery } from '../api/todosApi';
import TodoCard from '../components/TodoCard';
import CreateTodoModal from '../components/CreateTodoModal';
import { Plus, Search, ListTodo, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export default function TodoListPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const { data, isLoading, isFetching, isError, refetch } = useGetTodosQuery({
    query: search || undefined,
    PageNumber: page,
    PageSize: pageSize,
  });

  const todos = data?.data ?? [];

  // Подсчёт статистики по текущей странице
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const pendingCount = todos.filter((t) => !t.isCompleted).length;

  // Если данных меньше pageSize — следующей страницы нет
  const hasNext = todos.length === pageSize;
  const hasPrev = page > 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white font-sans">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                <ListTodo size={22} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Todo List
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-1">Управляй своими задачами</p>
          </div>

          <button
            id="btn-new-todo"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-100"
          >
            <Plus size={18} />
            Новая задача
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'На странице', value: todos.length, icon: <ListTodo size={16} />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Выполнено', value: completedCount, icon: <CheckCircle size={16} />, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'В процессе', value: pendingCount, icon: <Clock size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Поиск задач..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <button
            id="btn-search"
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-gray-300"
          >
            Найти
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-sm text-gray-400"
            >
              Сбросить
            </button>
          )}
        </form>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-3 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-gray-500">Загрузка задач...</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl">⚠️</div>
            <p className="text-gray-400">Ошибка загрузки данных</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-gray-300"
            >
              <RefreshCw size={14} /> Повторить
            </button>
          </div>
        )}

        {/* Todos grid */}
        {!isLoading && !isError && (
          <>
            {todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="text-6xl">📋</div>
                <p className="text-gray-400 text-lg font-medium">Задач пока нет</p>
                <p className="text-gray-600 text-sm">Нажми «Новая задача», чтобы начать</p>
              </div>
            ) : (
              <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {todos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {(hasPrev || hasNext) && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  id="btn-prev-page"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev || isFetching}
                  className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Назад
                </button>

                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold min-w-[60px] text-center">
                  {page}
                </span>

                <button
                  id="btn-next-page"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || isFetching}
                  className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Вперёд →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && <CreateTodoModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
