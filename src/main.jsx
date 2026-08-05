import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './index.css';
import { RotateCcw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Crash ErrorBoundary caught an exception:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-3xl mb-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
          </div>
          <h1 className="text-3xl font-black mb-2">Recuperação de Sistema Ativada</h1>
          <p className="text-sm text-slate-300 max-w-md mb-6 font-medium">
            Ocorreu uma inconsistência temporária de dados no navegador. Clique no botão abaixo para restaurar o sistema instantaneamente.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3.5 bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Restaurar e Abrir Sistema
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
