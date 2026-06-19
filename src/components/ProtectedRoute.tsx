import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../utils/token'

/**
 * Пропускает только аутентифицированных пользователей.
 * Неаутентифицированных редиректит на /login.
 */
export function ProtectedRoute() {
  const token = getToken()
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

/**
 * Пропускает только НЕаутентифицированных пользователей (login/signup).
 * Если уже вошёл — редиректит на /dashboard.
 */
export function GuestRoute() {
  const token = getToken()
  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />
}
