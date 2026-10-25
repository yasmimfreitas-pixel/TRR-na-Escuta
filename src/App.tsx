import React, { useState } from 'react';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PassagemPage from './pages/PassagemPage';

type View = 'home' | 'passagem' | 'privacy';

const highlights = [
  {
    icon: '🩺',
    label: 'Registro',
    title: 'Passagem em um só lugar',
    description:
      'Centraliza os dados essenciais do turno, pacientes, pendências e orientações da equipe com organização visual e intuitiva.',
  },
  {
    icon: '👩‍⚕️',
    label: 'Equipe',
    title: 'Comunicação ágil',
    description:
      'Compartilha informações de forma clara para que a equipe acompanhe o cuidado com rapidez, precisão e segurança.',
  },
  {
    icon: '🔒',
    label: 'Privacidade',
    title: 'Proteção e transparência',
    description:
      'Mantém a política de tratamento dos dados acessível, responsável e alinhada ao contexto hospitalar.',
  },
];

const chips = ['Atendimento', 'Segurança', 'Equipe', 'Pediatria', 'Cuidado'];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  if (view === 'passagem') {
    return <PassagemPage onBack={() => setView('home')} />;
  }

  if (view === 'privacy') {
    return <PrivacyPolicyPage onBack={() => setView('home')} />;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#fff9dc_0%,_#fdf2ff_24%,_#eef9ff_52%,_#f6fbff_100%)] text-slate-800">
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="floating-bubble absolute left-[8%] top-16 text-5xl opacity-80">🧸</span>
          <span className="floating-bubble absolute right-[12%] top-20 text-4xl opacity-80" style={{ animationDelay: '1.5s' }}>
            🩺
          </span>
          <span className="floating-bubble absolute bottom-14 left-[18%] text-4xl opacity-75" style={{ animationDelay: '2.4s' }}>
            🌈
          </span>
          <span className="floating-bubble absolute bottom-20 right-[20%] text-3xl opacity-75" style={{ animationDelay: '0.8s' }}>
            ⭐
          </span>
        </div>

        <header className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-[#1e63d4] via-[#3a9ef5] to-[#7ee7d3] p-6 shadow-[0_28px_80px_rgba(32,95,177,0.25)] sm:p-8 lg:p-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 left-10 h-24 w-24 rounded-full bg-yellow-200/25 blur-2xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-50 backdrop-blur-sm">
                TRR na Escuta
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Passagem de plantão com acolhimento pediátrico.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50 sm:text-base">
                Um sistema mais leve, acolhedor e dinâmico para registrar o cuidado da equipe, organizar pendências e manter a comunicação em movimento.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-50 backdrop-blur-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-sm rounded-[28px] border border-white/30 bg-white/12 p-4 text-white shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-blue-100">Hoje</p>
                  <p className="mt-2 text-2xl font-bold">Plantão</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-200 to-pink-300 text-3xl shadow-lg">
                  🧩
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Pacientes</span>
                    <span className="font-bold">12</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Pendências</span>
                    <span className="font-bold">04</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-100">Risco</span>
                    <span className="font-bold">Baixo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setView('passagem')}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:scale-[1.02] hover:bg-blue-50"
            >
              <span>🚀</span>
              Acessar passagem
            </button>

            <button
              type="button"
              onClick={() => setView('privacy')}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <span>📘</span>
              Ver política
            </button>
          </div>
        </header>

        <section className="relative mt-10 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.label}
              className="group rounded-[28px] border border-sky-100 bg-white/80 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.08)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(59,130,246,0.16)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff4a8] via-[#ffc7d9] to-[#c1ecff] text-3xl shadow-sm">
                {item.icon}
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">{item.label}</p>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="relative mt-10 rounded-[30px] border border-sky-100 bg-white/80 p-6 shadow-[0_18px_50px_rgba(148,163,184,0.15)] backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink-500">Acolhimento</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                Mais clareza para o cuidado infantil.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Acesse a passagem para registrar informações do turno atual, pacientes em acompanhamento, riscos, pendências e orientações da equipe com uma experiência visual mais amigável e funcional.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setView('passagem')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff9ab4] via-[#ffb36d] to-[#ffc83d] px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_12px_30px_rgba(255,154,180,0.4)] transition hover:scale-[1.02]"
            >
              <span>✨</span>
              Abrir passagem
            </button>
          </div>
        </section>

        <footer className="relative mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 TRR na Escuta</span>
          <button
            type="button"
            onClick={() => setView('privacy')}
            className="font-semibold text-blue-700 transition hover:text-blue-800"
          >
            Política de privacidade
          </button>
        </footer>
      </div>
    </main>
  );
};

export default App;
