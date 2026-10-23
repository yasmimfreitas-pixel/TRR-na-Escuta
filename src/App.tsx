import React, { useState } from 'react';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PassagemPage from './pages/PassagemPage';

type View = 'home' | 'passagem' | 'privacy';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  if (view === 'passagem') {
    return <PassagemPage onBack={() => setView('home')} />;
  }

  if (view === 'privacy') {
    return <PrivacyPolicyPage onBack={() => setView('home')} />;
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-8 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-100">TRR na Escuta</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Passagem de plantão</h1>
          <p className="mt-4 max-w-2xl text-sm text-blue-50 sm:text-base">
            Sistema para registro, organização e compartilhamento da passagem de plantão com a equipe.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setView('passagem')}
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Acessar passagem
            </button>
            <button
              type="button"
              onClick={() => setView('privacy')}
              className="inline-flex items-center rounded-lg border border-white/60 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver política
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Registro</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Plantões em um só lugar</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Centraliza os dados essenciais da passagem, incluindo turno, pacientes, pendências e segurança.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Equipe</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Compartilhamento rápido</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Permite disponibilizar a planilha diretamente no Google Drive para a equipe acompanhar em tempo real.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Privacidade</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Proteção e transparência</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Todas as informações seguem uma política clara de coleta, uso e armazenamento dos dados.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Passagem de plantão</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Acesse a página da passagem para registrar informações do turno atual, pacientes 
            em acompanhamento, riscos, pendências e orientações da equipe.
          </p>

          <button
            type="button"
            onClick={() => setView('passagem')}
            className="mt-5 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Abrir passagem
          </button>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 TRR na Escuta</span>
          <button
            type="button"
            onClick={() => setView('privacy')}
            className="font-medium text-blue-700 transition hover:text-blue-800"
          >
            Política de privacidade
          </button>
        </footer>
      </div>
    </main>
  );
};

export default App;
