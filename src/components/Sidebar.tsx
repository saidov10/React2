import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Wallet,
  Archive,
  Users,
  FolderClosed,
  ContactRound,
  Scale,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { clearToken } from '../utils/token'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { path: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/debts',     labelKey: 'nav.debts',     icon: Wallet          },
  { path: '/archive',   labelKey: 'nav.archive',   icon: Archive         },
  { path: '/contacts',  labelKey: 'nav.contacts',  icon: ContactRound    },
  { path: '/folders',   labelKey: 'nav.folders',   icon: FolderClosed    },
  { path: '/users',     labelKey: 'nav.users',     icon: Users           },
]

export default function Sidebar({ collapsed }: SidebarProps) {
  const { t } = useTranslation()
  const [profileOpen, setProfileOpen] = useState(false)

  // Read user info from localStorage if available
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user_info') || '{}') } catch { return {} }
  })()
  const userName = storedUser?.name ?? 'User'
  const userEmail = storedUser?.email ?? ''

  const handleLogout = () => {
    clearToken()
    localStorage.removeItem('user_info')
    window.location.href = '/login'
  }

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40 flex flex-col
        bg-white dark:bg-[#1c2233]
        border-r border-slate-200 dark:border-[#2a3347]
        shadow-sm transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* ── Logo ── */}
      <div className={`flex items-center gap-3 px-4 h-[70px] border-b border-slate-200 dark:border-[#2a3347] shrink-0 overflow-hidden`}>
        <div className="w-9 h-9 rounded-full bg-white dark:bg-[#1e2738] border border-slate-200 dark:border-slate-600/50 flex items-center justify-center shadow-sm shrink-0">
          <Scale className="h-4 w-4 text-emerald-500" />
        </div>
        {!collapsed && (
          <span className="text-slate-900 dark:text-white font-extrabold text-base tracking-tight whitespace-nowrap">
            ADL 5:8
          </span>
        )}
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(({ path, labelKey, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? t(labelKey) : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  className={`shrink-0 transition-colors ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white'}`}
                />
                {!collapsed && (
                  <span className="text-sm whitespace-nowrap">{t(labelKey)}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User Profile Footer ── */}
      <div className="shrink-0 border-t border-slate-200 dark:border-[#2a3347] p-3">
        <div className="relative">
          {/* Profile popup */}
          {profileOpen && !collapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#1c2233] border border-slate-200 dark:border-[#2a3347] rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setProfileOpen(o => !o)}
            className={`flex items-center gap-3 w-full rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
              {userName.charAt(0).toUpperCase()}
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{userName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{userEmail || 'Owner'}</p>
                </div>
                <ChevronRight
                  size={16}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${profileOpen ? 'rotate-90' : ''}`}
                />
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
