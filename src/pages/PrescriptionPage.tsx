import React, { useMemo, useState } from 'react';

 type Med = {
  id: string;
  name: string;
  concentration: number;
  unit: string;
  dose: number;
  maxPerDose?: number;
  frequency: string;
  days: number;
  group: 'oral' | 'evim';
};

const MEDS: Med[] = [
  { id:'amox', name:'Amoxicilina 250 mg/5 mL', concentration:50, unit:'mg/mL', dose:40, maxPerDose:2000, frequency:'8/8 h', days:10, group:'oral' },
  { id:'clav', name:'Amoxicilina + Clavulanato 400/57 mg por 5 mL', concentration:80, unit:'mg/mL', dose:45, maxPerDose:875, frequency:'12/12 h', days:10, group:'oral' },
  { id:'cefu', name:'Cefuroxima 250 mg/5 mL', concentration:50, unit:'mg/mL', dose:15, maxPerDose:500, frequency:'12/12 h', days:10, group:'oral' },
  { id:'azit', name:'Azitromicina 200 mg/5 mL', concentration:40, unit:'mg/mL', dose:10, maxPerDose:500, frequency:'1x/dia', days:5, group:'oral' },
  { id:'paracetamol', name:'Paracetamol 200 mg/mL', concentration:200, unit:'mg/mL', dose:15, maxPerDose:750, frequency:'6/6 h, se necessário', days:3, group:'oral' },
  { id:'ibu', name:'Ibuprofeno 100 mg/mL', concentration:100, unit:'mg/mL', dose:10, maxPerDose:400, frequency:'8/8 h, se necessário', days:3, group:'oral' },
  { id:'dipirona', name:'Dipirona 500 mg/mL', concentration:500, unit:'mg/mL', dose:20, maxPerDose:1000, frequency:'6/6 h, se necessário', days:3, group:'oral' },
  { id:'ond', name:'Ondansetrona 0,8 mg/mL', concentration:0.8, unit:'mg/mL', dose:0.15, maxPerDose:8, frequency:'8/8 h, se necessário', days:2, group:'oral' },
  { id:'pred', name:'Prednisolona 3 mg/mL', concentration:3, unit:'mg/mL', dose:1, maxPerDose:50, frequency:'1x/dia pela manhã', days:5, group:'oral' },
];

const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export const PrescriptionPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [patient, setPatient] = useState('');
  const [age, setAge] = useState(3);
  const [ageUnit, setAgeUnit] = useState<'anos'|'meses'>('anos');
  const [weight, setWeight] = useState(12);
  const [selected, setSelected] = useState<string[]>(['amox']);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [conduct, setConduct] = useState('Retorno após medicação.');
  const [orientation, setOrientation] = useState('Retornar à emergência se piora dos sintomas, sinais de desidratação, falta de ar ou sonolência.');

  const months = ageUnit === 'anos' ? age * 12 : age;
  const lines = useMemo(() => selected.map(id => {
    const m = MEDS.find(x => x.id === id)!;
    let doseMg = weight * (overrides[id] ?? m.dose);
    let maxNote = '';
    if (m.maxPerDose && doseMg > m.maxPerDose) {
      doseMg = m.maxPerDose;
      maxNote = ` • limitada à dose máxima de ${fmt(m.maxPerDose)} mg/dose`;
    }
    const volume = doseMg / m.concentration;
    return { m, doseMg, volume, maxNote };
  }), [selected, weight, overrides]);

  const toggle = (id: string) => setSelected(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);

  const prescription = useMemo(() => {
    const header = `PACIENTE: ${patient || '________________'}\nIDADE: ${age || '—'} ${ageUnit}     PESO: ${weight || '—'} kg     DATA: ${new Date().toLocaleDateString('pt-BR')}`;
    const meds = lines.map(({m,doseMg,volume,maxNote}, i) => {
      if (m.id === 'ond') return `${i+1}. ${m.name}\nTomar ${fmt(volume)} mL (${fmt(doseMg)} mg) até de ${m.frequency}; por ${m.days} dias.${maxNote}`;
      if (m.frequency.includes('se necessário')) return `${i+1}. ${m.name}\nTomar ${fmt(volume)} mL (${fmt(doseMg)} mg), até de ${m.frequency}; por ${m.days} dias.${maxNote}`;
      return `${i+1}. ${m.name}\nTomar ${fmt(volume)} mL (${fmt(doseMg)} mg) de ${m.frequency}, por ${m.days} dias.${maxNote}`;
    }).join('\n\n');
    return [header, meds || 'Nenhum medicamento selecionado.', conduct ? `CONDUTA:\n${conduct}` : '', orientation ? `ORIENTAÇÕES:\n${orientation}` : '', 'Assinatura / carimbo: __________________________'].filter(Boolean).join('\n\n');
  }, [patient, age, ageUnit, weight, lines, conduct, orientation]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(prescription); } catch { /* fallback não necessário */ }
  };

  return (
    <main className="min-h-screen bg-[#f8f7fc] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <button onClick={onBack} className="mb-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">← Voltar</button>
        <header className="rounded-[28px] bg-gradient-to-r from-violet-700 to-fuchsia-600 p-6 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-100">Prescrição pediátrica</p>
          <h1 className="mt-2 text-3xl font-black">Receitas ajustáveis por idade e peso</h1>
          <p className="mt-2 max-w-2xl text-sm text-violet-100">Monte a prescrição, ajuste doses e revise a receita antes de imprimir.</p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <h2 className="font-black text-violet-800">Dados do paciente</h2>
              <label className="mt-4 block text-sm font-semibold">Nome / identificação
                <input value={patient} onChange={e=>setPatient(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5" placeholder="Opcional" />
              </label>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <label className="text-sm font-semibold">Peso (kg)
                  <input type="number" min="0.5" max="100" step="0.1" value={weight} onChange={e=>setWeight(Number(e.target.value)||0)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold">Idade
                  <input type="number" min="0" step="0.1" value={age} onChange={e=>setAge(Number(e.target.value)||0)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5" />
                </label>
                <label className="text-sm font-semibold">Unidade
                  <select value={ageUnit} onChange={e=>setAgeUnit(e.target.value as 'anos'|'meses')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5">
                    <option>anos</option><option>meses</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <h2 className="font-black text-violet-800">Medicamentos</h2>
              <div className="mt-3 space-y-2">
                {MEDS.filter(m=>m.group==='oral').map(m => (
                  <label key={m.id} className={`block cursor-pointer rounded-xl border p-3 transition ${selected.includes(m.id)?'border-violet-400 bg-violet-50':'border-slate-200 bg-white'}`}>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked={selected.includes(m.id)} onChange={()=>toggle(m.id)} className="mt-1 h-4 w-4 accent-violet-600" />
                      <div className="min-w-0 flex-1"><p className="text-sm font-bold">{m.name}</p><p className="mt-1 text-xs text-slate-500">{m.dose} mg/kg/dose • {m.frequency}</p></div>
                    </div>
                    {selected.includes(m.id) && <div className="mt-3 flex items-center gap-2 pl-7"><span className="text-xs text-slate-600">Dose ajustada</span><input type="number" min="0" step="0.1" value={overrides[m.id] ?? m.dose} onChange={e=>setOverrides(v=>({...v,[m.id]:Number(e.target.value)||0}))} className="w-24 rounded-lg border border-violet-200 px-2 py-1 text-sm" /><span className="text-xs text-slate-500">mg/kg</span></div>}
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <label className="block text-sm font-bold">Conduta
                <select value={conduct} onChange={e=>setConduct(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5">
                  <option value="">Não incluir</option><option>Alta após medicação.</option><option>Retorno após medicação.</option><option>Encaminho para observação.</option><option>Aguarda internamento.</option>
                </select>
              </label>
              <label className="mt-4 block text-sm font-bold">Orientações
                <textarea value={orientation} onChange={e=>setOrientation(e.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              </label>
            </section>
          </div>

          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Prévia da receita</p><h2 className="mt-1 text-xl font-black">{months < 24 ? 'Pediatria' : 'Prescrição'}</h2></div>
              <div className="flex gap-2"><button onClick={copy} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Copiar</button><button onClick={()=>window.print()} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-bold text-white">Imprimir</button></div>
            </div>
            <pre className="mt-5 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-800">{prescription}</pre>
            {lines.map(({m,doseMg,volume,maxNote}) => <p key={m.id} className="mt-2 text-xs text-sky-700">Conta: peso × dose configurada = {fmt(doseMg)} mg; concentração = {m.concentration} mg/mL; volume = {fmt(volume)} mL{maxNote}</p>)}
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">Protótipo de apoio à prescrição. Confirme doses, concentrações, contraindicações e limites máximos antes de prescrever. Nenhum dado é salvo.</p>
      </div>
    </main>
  );
};
export default PrescriptionPage;
