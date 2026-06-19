import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from './theme-provider'
import {
  Menu,
  Languages,
  Bell,
  Maximize,
  Minimize,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  X,
} from 'lucide-react'

interface HeaderProps {
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export default function Header({ sidebarCollapsed, onSidebarToggle }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const toggleLanguage = () => {
    const langs = ['en', 'ru', 'tg']
    const cur = i18n.language?.substring(0, 2) ?? 'en'
    const idx = langs.includes(cur) ? langs.indexOf(cur) : 0
    i18n.changeLanguage(langs[(idx + 1) % langs.length])
  }

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
    const idx = themes.indexOf(theme)
    setTheme(themes[(idx + 1) % themes.length])
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const sidebarWidth = sidebarCollapsed ? 72 : 260

  const iconBtn = 'relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer'

  return (
    <header
      className="fixed top-0 right-0 z-30 h-[70px] flex items-center px-4 gap-3 bg-white dark:bg-[#1c2233] border-b border-slate-200 dark:border-[#2a3347] transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      {/* ── Sidebar Toggle ── */}
      <button
        id="sidebar-toggle-btn"
        onClick={onSidebarToggle}
        className={`${iconBtn} hover:bg-slate-100 dark:hover:bg-slate-700`}
        title="Toggle Sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Right actions ── */}
      <div className="flex items-center gap-1">

        {/* Language */}
        <button
          id="header-lang-btn"
          onClick={toggleLanguage}
          className={iconBtn}
          title={t('language.toggle', 'Language')}
        >
          <Languages size={18} />
        </button>

        {/* Theme Toggle */}
        <button
          id="header-theme-btn"
          onClick={toggleTheme}
          className={iconBtn}
          title={t('theme.toggle', 'Toggle theme')}
        >
          {theme === 'light' && <Sun size={18} className="text-amber-500" />}
          {theme === 'dark'  && <Moon size={18} className="text-blue-400" />}
          {theme === 'system' && <Monitor size={18} />}
        </button>

        {/* Sync status */}
        <div
          className={`${iconBtn} cursor-default`}
          title="All changes synced"
        >
          <CheckCircle2 size={18} className="text-emerald-500" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="header-notif-btn"
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
            className={iconBtn}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1c2233]" />
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute top-12 right-0 w-80 bg-white dark:bg-[#1c2233] border border-slate-200 dark:border-[#2a3347] rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#2a3347]">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Notifications</h3>
                <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button
          id="header-fullscreen-btn"
          onClick={toggleFullscreen}
          className={iconBtn}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* User Avatar */}
        <div className="relative ml-1">
          <button
            id="header-profile-btn"
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow ring-2 ring-white dark:ring-[#1c2233] hover:ring-blue-300 transition-all"
            title="Profile"
          >
            {(() => {
              try {
                const u = JSON.parse(localStorage.getItem('user_info') || '{}')
                return (u?.name ?? 'U').charAt(0).toUpperCase()
              } catch { return 'U' }
            })()}
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="absolute top-12 right-0 w-52 bg-white dark:bg-[#1c2233] border border-slate-200 dark:border-[#2a3347] rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#2a3347]">
                {(() => {
                  try {
                    const u = JSON.parse(localStorage.getItem('user_info') || '{}')
                    return (
                      <>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{u?.name ?? 'User'}</p>
                        <p className="text-xs text-slate-400 truncate">{u?.email ?? ''}</p>
                      </>
                    )
                  } catch {
                    return <p className="text-sm text-slate-500">User</p>
                  }
                })()}
              </div>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/login'
                }}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
