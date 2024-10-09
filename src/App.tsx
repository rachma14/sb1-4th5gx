import { Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './contexts/SettingsContext'
import Dashboard from './pages/Dashboard'
import RoomManagement from './pages/RoomManagement'
import GuestManagement from './pages/GuestManagement'
import Reservations from './pages/Reservations'
import Billing from './pages/Billing'
import Accounting from './pages/Accounting'
import Settings from './pages/Settings'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomManagement />} />
            <Route path="/guests" element={<GuestManagement />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </SettingsProvider>
    </ErrorBoundary>
  )
}

export default App