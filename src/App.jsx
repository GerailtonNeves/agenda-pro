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

// Public & SuperAdmin
import { PublicBookingView } from './components/public/PublicBookingView';
import { SuperAdminView } from './components/superadmin/SuperAdminView';

import { Menu, X, Sparkles } from 'lucide-react';

export function App() {
  const { currentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Standalone Public Booking Route
  if (currentView === 'agendamentoPublico') {
    return <PublicBookingView />;
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
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-black text-lg text-white">Agenda<span className="text-sky-300">Pro</span></span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-sky-300 border border-slate-700 font-bold flex items-center gap-1 text-xs"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          <span>Menu</span>
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer Overlay */}
      <div className={`fixed inset-0 z-50 lg:relative lg:z-auto flex ${mobileMenuOpen ? 'block' : 'hidden lg:flex'}`}>
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs lg:hidden"
        />

        <div className="relative z-10 w-72 max-w-[85vw] lg:max-w-none h-[100dvh]">
          <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderView()}
        </main>
      </div>

      {/* Global Application Modals, PWA Install & Toast Banners */}
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
