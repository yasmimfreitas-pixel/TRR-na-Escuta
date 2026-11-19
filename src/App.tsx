import React, { useState } from 'react';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PassagemPage from './pages/PassagemPage';
import PrescriptionPage from './pages/PrescriptionPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

type View = 'home' | 'passagem' | 'prescription' | 'privacy' | 'terms';

const chips = ['Atendimento', 'Segurança', 'Equipe', 'Pediatria', 'Cuidado'];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  if (view === 'passagem') return <PassagemPage onBack={() => setView('home')} />;
  if (view === 'prescription') return <PrescriptionPage onBack={() => setView('home')} />;
  if (view === 'privacy') return <PrivacyPolicyPage onBack={() => setView('home')} />;
  if (view === 'terms') return <TermsOfServicePage onBack={() => setView('home')} />;

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#fff9dc_0%,_#fdf2ff_24%,_#eef9ff_52%,_#f6fbff_100%)] text-slate-800">
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-[#1e63d4] via-[#3a9ef5] to-[#7ee7d3] p-6 shadow-[0_28px_80px_rgba(32,95,177,0.25)] sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-50">TRR na Escuta</div>
            <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">Cuidado pediátrico com mais organização.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50 sm:text-base">Passagens de plantão e prescrições ajustáveis por idade e peso em uma única área de trabalho.</p>
            <div className="mt-5 flex flex-wrap gap-2">{chips.map(chip => <span key={chip} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-50">{chip}</span>)}</div>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <button onClick={() => setView('prescription')} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg">💊 Criar receita</button>
            <button onClick={() => setView('passagem')} className="rounded-full bg-slate-900/15 px-5 py-3 text-sm font-bold text-white backdrop-blur">🚀 Passagem de plantão</button>
            <button onClick={() => setView('privacy')} className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white">📘 Política</button>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <button onClick={() => setView('prescription')} className="rounded-[26px] border border-violet-100 bg-white p-6 text-left shadow-[0_18px_40px_rgba(124,58,237,0.08)] transition hover:-translate-y-1">
            <span className="text-4xl">💊</span><h2 className="mt-4 text-2xl font-black text-slate-900">Receita pediátrica</h2><p className="mt-3 text-sm leading-7 text-slate-600">Escolha medicamentos, ajuste idade e peso, visualize o volume e copie ou imprima a receita.</p>
          </button>
          <button onClick={() => setView('passagem')} className="rounded-[26px] border border-sky-100 bg-white p-6 text-left shadow-[0_18px_40px_rgba(59,130,246,0.08)] transition hover:-translate-y-1">
            <span className="text-4xl">🩺</span><h2 className="mt-4 text-2xl font-black text-slate-900">Passagem de plantão</h2><p className="mt-3 text-sm leading-7 text-slate-600">Registre o turno, pacientes, pendências e comunicações da equipe.</p>
          </button>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 TRR na Escuta</span>
          <div className="flex gap-3"><button onClick={() => setView('privacy')} className="font-semibold text-blue-700">Política de privacidade</button><button onClick={() => setView('terms')} className="font-semibold text-blue-700">Termos de serviço</button></div>
        </footer>
      </div>
    </main>
  );
};
export default App;
