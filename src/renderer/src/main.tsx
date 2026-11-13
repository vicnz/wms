import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouterManager from './routes'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer/>
    <AuthProvider>
      <AppRouterManager />
    </AuthProvider>
  </StrictMode>
)
