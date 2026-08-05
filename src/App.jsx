import React, { useState } from 'react';
import { useApp } from './context/AppContext';

// Layout Components
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { ImageUploaderModal } from './components/common/ImageUploaderModal';
import { WhatsAppModal } from './components/common/WhatsAppModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { BudgetModal } from './components/common/BudgetModal';
import { LicenseExpiredLockModal } from './components/common/LicenseExpiredLockModal';
import { NewAppointmentToastModal } from './components/common/NewAppointmentToastModal';
import { PwaInstallModal } from './components/common/PwaInstallModal';

// Auth Views
import { LoginView } from './components/auth/LoginView';

// Main Views
import { DashboardView } from './components/dashboard/DashboardView';
import { AgendaView } from './components/agenda/AgendaView';
import { FuncionariosView } from './components/funcionarios/FuncionariosView';
import { ServicosView } from './components/servicos/ServicosView';
import { ProdutosView } from './components/produtos/ProdutosView';
import { ClientesView } from './components/clientes/ClientesView';
import { FinanceiroView } from './components/financeiro/FinanceiroView';
import { RecibosView } from './components/recibos/RecibosView';
import { OrcamentosView } from './components/orcamentos/OrcamentosView';
import { LembretesView } from './components/lembretes/LembretesView';
import { NotificacoesView } from './components/notificacoes/NotificacoesView';
import { RelatoriosView } from './components/relatorios/RelatoriosView';
import { ConfiguracoesView } from './components/configuracoes/ConfiguracoesView';
import { SupabaseView } from './components/supabase/SupabaseView';

// Public & SuperAdmin Views
import { PublicBookingView } from './components/public/PublicBookingView';
import { AppInstallView } from './components/public/AppInstallView';
import { SuperAdminView } from './components/superadmin/SuperAdminView';

import { Menu, X, Sparkles } from 'lucide-react';

export function App() {
  const { currentView, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Standalone Public Routes:
  // 1. Employee / Company Public Booking Page (LINK 2)
  if (currentView === 'agendamentoPublico') {
    return <PublicBookingView />;
  }

  // 2. Buyer App Installation & Key Activation Page (LINK 1)
  if (currentView === 'instalacaoApp') {
    return <AppInstallView />;
  }

  // Mandatory Authentication: Require Login/Password for System Access
  if (!currentUser) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'agenda':
        return <AgendaView />;
      case 'funcionarios':
        return <FuncionariosView />;
      case 'servicos':
        return <ServicosView />;
      case 'produtos':
        return <ProdutosView />;
      case 'clientes':
        return <ClientesView />;
      case 'financeiro':
        return <FinanceiroView />;
      case 'recibos':
        return <RecibosView />;
      case 'orcamentos':
        return <OrcamentosView />;
      case 'lembretes':
        return <LembretesView />;
      case 'notificacoes':
        return <NotificacoesView />;
      case 'relatorios':
        return <RelatoriosView />;
      case 'supabase':
        return <SupabaseView />;
      case 'configuracoes':
        return <ConfiguracoesView />;
      case 'superadmin':
        return <SuperAdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-950 font-sans antialiased selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-300 to-cyan-300 text-slate-950 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight text-white leading-tight">
              Agenda<span className="text-sky-400">Pro</span>
            </h1>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
              SaaS Multi-Empresa
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition border border-slate-700"
          aria-label="Alternar Menu Lateral"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Slide-out Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 h-full bg-slate-950 text-white shadow-2xl animate-slideInLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 z-30">
        <Sidebar />
      </div>

      {/* Main App Content View Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderView()}
        </main>
      </div>

      {/* Global Interactive Modals & Toasts */}
      <ImageUploaderModal />
      <WhatsAppModal />
      <ReceiptModal />
      <BudgetModal />
      <LicenseExpiredLockModal />
      <NewAppointmentToastModal />
      <PwaInstallModal />
    </div>
  );
}

export default App;
