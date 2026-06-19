import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'
import { Toaster } from 'sonner'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

// Lazy loaded page components
const Landing  = lazy(() => import('./pages/landing'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const Debts    = lazy(() => import('./pages/debts'))
const Archive  = lazy(() => import('./pages/archive'))
const Contacts = lazy(() => import('./pages/contacts'))
const Folders  = lazy(() => import('./pages/folders'))
const Users    = lazy(() => import('./pages/users'))
const Login    = lazy(() => import('./pages/login'))
const Signup   = lazy(() => import('./pages/signup'))

/* ─────────────────────────────────────────────
   Dashboard Layout — Sidebar + Header + Content
───────────────────────────────────────────── */
function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 72 : 260

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-foreground">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      {/* Header */}
      <Header
        sidebarCollapsed={collapsed}
        onSidebarToggle={() => setCollapsed(c => !c)}
      />

      {/* Main content — offset by sidebar width + header height */}
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarWidth, marginTop: 70 }}
      >
        <div className="p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64 space-x-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

/* ─────────────────────────────────────────────
   App Root
───────────────────────────────────────────── */
export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster position="top-center" richColors closeButton />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center space-x-2 text-white">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
            </div>
          }
        >
          <Routes>
            {/* Public page — always accessible */}
            <Route path="/" element={<Landing />} />

            {/* Guest-only routes — redirect to /dashboard if already logged in */}
            <Route element={<GuestRoute />}>
              <Route path="/login"  element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected routes — redirect to /login if not authenticated */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/debts"     element={<Debts />} />
                <Route path="/archive"   element={<Archive />} />
                <Route path="/contacts"  element={<Contacts />} />
                <Route path="/folders"   element={<Folders />} />
                <Route path="/users"     element={<Users />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  )
}