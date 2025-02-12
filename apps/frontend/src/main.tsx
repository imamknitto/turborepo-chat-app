import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SocketProvider from './components/socket-provider.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <App />
        <Toaster />
      </ThemeProvider>
    </SocketProvider>
  </StrictMode>,
)
