import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './app/components/PrivateRoute'
import { Layout } from './app/components/Layout'
import { Login } from './app/pages/Login'
import { Feed } from './app/pages/Feed'
import { EventDetails } from './app/pages/EventDetails'
import { OrganizerDashboard } from './app/pages/OrganizerDashboard'
import { Profile } from './app/pages/Profile'
import { Notifications } from './app/pages/Notifications'
import { Amigos } from './app/pages/Amigos'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('No root element')

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/organize" element={<OrganizerDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/amigos" element={<Amigos />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
