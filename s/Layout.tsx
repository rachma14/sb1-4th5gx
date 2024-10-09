import React from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Hotel Management</h1>
        </div>
        <ul className="mt-4">
          <li>
            <Link to="/" className="block p-4 hover:bg-gray-200">Dashboard</Link>
          </li>
          <li>
            <Link to="/rooms" className="block p-4 hover:bg-gray-200">Room Management</Link>
          </li>
          <li>
            <Link to="/guests" className="block p-4 hover:bg-gray-200">Guest Management</Link>
          </li>
          <li>
            <Link to="/reservations" className="block p-4 hover:bg-gray-200">Reservations</Link>
          </li>
          <li>
            <Link to="/billing" className="block p-4 hover:bg-gray-200">Billing</Link>
          </li>
          <li>
            <Link to="/accounting" className="block p-4 hover:bg-gray-200">Accounting</Link>
          </li>
          <li>
            <Link to="/settings" className="block p-4 hover:bg-gray-200">Settings</Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout