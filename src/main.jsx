import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ServerStatusProvider, useServerStatus } from './presentation/context/ServerStatusContext.jsx'
import { ServerWakingOverlay } from './presentation/components/ServerWakingOverlay.jsx'
import { configureServerStatusCallbacks } from './infrastructure/http/httpClient.js'

function ServerStatusBridge() {
  const {
    notifyWaking,
    notifyRetry,
    notifyError,
    notifyRequestStart,
    notifyRequestEnd,
  } = useServerStatus()

  configureServerStatusCallbacks({
    onWarn: notifyWaking,
    onRetry: notifyRetry,
    onError: notifyError,
    onRequestStart: notifyRequestStart,
    onRequestEnd: notifyRequestEnd,
  })

  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServerStatusProvider>
      <ServerStatusBridge />
      <App />
      <ServerWakingOverlay />
    </ServerStatusProvider>
  </StrictMode>,
)