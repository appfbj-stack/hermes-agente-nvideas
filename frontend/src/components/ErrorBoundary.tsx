import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Padrão de Auditoria: Fallback Seguro de Frontend
 * Captura erros não tratados no React para não quebrar a tela branca (White Screen of Death)
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border-red-500/30 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado.</h1>
            <p className="text-gray-400 text-sm mb-6">
              Ocorreu um erro inesperado neste módulo. Nossa equipe já foi notificada.
            </p>
            <button
              onClick={() => window.location.href = '/t'}
              className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-xl font-medium transition-colors w-full"
            >
              Voltar ao Painel
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-black/50 rounded-lg text-left overflow-auto text-xs text-red-400 font-mono">
                {this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
