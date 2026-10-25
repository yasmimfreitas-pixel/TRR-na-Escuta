import React, { useMemo, useState } from 'react';

type TabKey = 'sinais' | 'doses' | 'dispositivos';

type PediatricVital = {
  faixa: string;
  fc: string;
  fr: string;
  pas: string;
  pad: string;
  sao2: string;
};

type DrugDose = {
  medicamento: string;
  via: string;
  dose: string;
  observacao: string;
};

type Device = {
  item: string;
  tamanho: string;
  indicacao: string;
};

const pediatricVitals: PediatricVital[] = [
  {
    faixa: 'Recém-nascido / lactente menor',
    fc: '100-160 bpm',
    fr: '30-60 rpm',
    pas: '60-80 mmHg',
    pad: '40-60 mmHg',
    sao2: '≥ 94%',
  },
  {
    faixa: 'Lactente / criança pequena',
    fc: '80-130 bpm',
    fr: '24-40 rpm',
    pas: '80-100 mmHg',
    pad: '50-65 mmHg',
    sao2: '≥ 94%',
  },
  {
    faixa: 'Criança / adolescente',
    fc: '70-110 bpm',
    fr: '18-30 rpm',
    pas: '90-120 mmHg',
    pad: '60-80 mmHg',
    sao2: '≥ 94%',
  },
];

const pediatricDoses: DrugDose[] = [
  {
    medicamento: 'Adrenalina',
    via: 'IV/IO',
    dose: '0,01 mg/kg (0,1 mL/kg de 1:10.000)',
    observacao: 'Repetir a cada 3-5 min conforme ritmo e resposta hemodinâmica.',
  },
  {
    medicamento: 'Amiodarona',
    via: 'IV/IO',
    dose: '5 mg/kg',
    observacao: 'Infundir em 20-60 min; considerar dose de carga de 5 mg/kg em 20-60 min.',
  },
  {
    medicamento: 'Adenosina',
    via: 'IV/IO rápido',
    dose: '0,1 mg/kg',
    observacao: 'Dose máxima inicial 6 mg; repetir 0,2 mg/kg se necessário.',
  },
  {
    medicamento: 'Atropina',
    via: 'IV/IO',
    dose: '0,02 mg/kg',
    observacao: 'Dose mínima 0,1 mg; repetir se necessário em bradicardia sintomática.',
  },
  {
    medicamento: 'Dextrose',
    via: 'IV',
    dose: '5 mL/kg de D10%',
    observacao: 'Corregir hipoglicemia e reavaliar glicemia em 5-10 min.',
  },
];

const pediatricDevices: Device[] = [
  {
    item: 'Máscara facial',
    tamanho: 'Neonatal / pediátrica / infantil',
    indicacao: 'Oxigenação suplementar em ventilação espontânea e suporte inicial.',
  },
  {
    item: 'BVM',
    tamanho: 'Pediátrico com selo adequado',
    indicacao: 'Ventilação com massa corporal e volume tidal apropriados.',
  },
  {
    item: 'Manga/airway',
    tamanho: 'Conforme faixa etária',
    indicacao: 'Avaliação de via aérea e ventilação com seleção correta do tamanho.',
  },
  {
    item: 'Acesso IV/IO',
    tamanho: '1-2 tentativas IV; IO se falhar',
    indicacao: 'Acesso venoso para medicamentos de emergência e fluidos.',
  },
  {
    item: 'Monitor',
    tamanho: 'Pediátrico',
    indicacao: 'ECG, SpO2, pressão arterial e frequência respiratória contínuos.',
  },
];

const tabs: { key: TabKey; label: string }[] = [
  { key: 'sinais', label: 'Sinais vitais' },
  { key: 'doses', label: 'Doses de medicação' },
  { key: 'dispositivos', label: 'Dispositivos e urgências' },
];

const formatSubtitle = (tab: TabKey) => {
  switch (tab) {
    case 'sinais':
      return 'Faixas de normalidade por idade';
    case 'doses':
      return 'Terapêutica emergencial pediátrica';
    case 'dispositivos':
      return 'Acesso, ventilação e suporte imediato';
    default:
      return '';
  }
};

export const PassagemPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('sinais');

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'sinais':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">Atenção</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Interpretação clínica deve considerar faixa etária, perfusão, nível de consciência e resposta ao tratamento.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Faixa etária</th>
                    <th className="px-4 py-3 font-semibold">FC</th>
                    <th className="px-4 py-3 font-semibold">FR</th>
                    <th className="px-4 py-3 font-semibold">PAS</th>
                    <th className="px-4 py-3 font-semibold">PAD</th>
                    <th className="px-4 py-3 font-semibold">SpO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {pediatricVitals.map((item) => (
                    <tr key={item.faixa} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-800">{item.faixa}</td>
                      <td className="px-4 py-3">{item.fc}</td>
                      <td className="px-4 py-3">{item.fr}</td>
                      <td className="px-4 py-3">{item.pas}</td>
                      <td className="px-4 py-3">{item.pad}</td>
                      <td className="px-4 py-3">{item.sao2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'doses':
        return (
          <div className="space-y-4">
            {pediatricDoses.map((item) => (
              <div key={item.medicamento} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{item.medicamento}</h3>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {item.via}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-blue-700">Dose: {item.dose}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.observacao}</p>
              </div>
            ))}
          </div>
        );

      case 'dispositivos':
        return (
          <div className="space-y-4">
            {pediatricDevices.map((item) => (
              <div key={item.item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{item.item}</h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {item.tamanho}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.indicacao}</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f2f9ff_0%,_#eff9ff_28%,_#fff6eb_60%,_#ffffff_100%)] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span>←</span>
            Voltar
          </button>

          <div className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
            AHA/PALS
          </div>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-sky-100 bg-white/80 shadow-[0_24px_60px_rgba(37,99,235,0.08)] backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#1f5ecc] via-[#3d9af7] to-[#71d8d0] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-100">TRR na Escuta</p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Suporte avançado em pediatria</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
              Referência rápida para sinais vitais por faixa etária, doses de medicação emergencial e dispositivos utilizados em urgência pediátrica.
            </p>
          </div>

          <div className="border-b border-slate-200 bg-slate-50/60 p-3">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-semibold transition',
                      isActive
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">Módulo</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">{tabs.find((tab) => tab.key === activeTab)?.label}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {formatSubtitle(activeTab)}
              </span>
            </div>

            {tabContent}
          </div>
        </section>
      </div>
    </main>
  );
};

export default PassagemPage;
