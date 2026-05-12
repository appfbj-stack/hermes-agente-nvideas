import { Component, ReactNode, StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

type FatalError = {
  message: string
  stack?: string
}

class RootErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6">
          <div className="max-w-2xl w-full glass-panel rounded-2xl p-6 border border-red-500/20">
            <div className="text-white font-bold text-lg">Erro ao renderizar</div>
            <div className="text-gray-300 mt-2 text-sm break-words">{error.message}</div>
            {error.stack && (
              <pre className="mt-4 text-xs text-gray-400 whitespace-pre-wrap break-words">{error.stack}</pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function RootApp() {
  const [fatal, setFatal] = useState<FatalError | null>(null)

  useEffect(() => {
    ;(window as any).__APP_BOOTED__ = true
    const onError = (event: ErrorEvent) => {
      setFatal({ message: event.message || 'Erro desconhecido', stack: event.error?.stack })
    }
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      const message = reason?.message ? String(reason.message) : String(reason ?? 'Promise rejeitada')
      const stack = reason?.stack ? String(reason.stack) : undefined
      setFatal({ message, stack })
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onRejection)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onRejection)
    }
  }, [])

  if (fatal) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6">
        <div className="max-w-2xl w-full glass-panel rounded-2xl p-6 border border-red-500/20">
          <div className="text-white font-bold text-lg">Falha na aplicação</div>
          <div className="text-gray-300 mt-2 text-sm break-words">{fatal.message}</div>
          {fatal.stack && (
            <pre className="mt-4 text-xs text-gray-400 whitespace-pre-wrap break-words">{fatal.stack}</pre>
          )}
        </div>
      </div>
    )
  }

  return (
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
