import { Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from './lib/auth'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import GraphPage from './pages/GraphPage'
import SearchPage from './pages/SearchPage'
import About from './pages/About'
import AppShell from './components/AppShell'

/* Route guard for authenticated pages */
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="notes" element={<Dashboard />} />
        <Route path="graph" element={<GraphPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<About />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
