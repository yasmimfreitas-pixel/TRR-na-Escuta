import React from 'react';
import { Pill, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';

export const DosesDispositivosView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* PALS Warning Banner */}
      <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-950 dark:text-rose-200 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div>
          <strong>Referência rápida para emergências pediátricas (PALS / AHA).</strong> Confira
          sempre com o protocolo institucional do Hospital SOPAI e a diluição disponível na
          farmácia/carrinho de parada da unidade antes da administração.
        </div>
      </div>

      {/* Emergency Medications */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
          <Pill className="w-5 h-5 text-purple-600" />
          Medicações de Emergência Pediátrica
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3">Medicação</th>
                <th className="py-2.5 px-3">Dose recomendada</th>
                <th className="py-2.5 px-3">Dose máxima</th>
                <th className="py-2.5 px-3">Observações / Diluição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-rose-600">Epinefrina (PCR) IV/IO</td>
                <td className="py-2.5 px-3 font-mono font-medium">0,01 mg/kg (0,1 mL/kg 1:10.000)</td>
                <td className="py-2.5 px-3 font-mono">1 mg (10 mL)</td>
                <td className="py-2.5 px-3">Repetir a cada 3–5 min de PCR; flush de SF 5 mL</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Epinefrina via ET</td>
                <td className="py-2.5 px-3 font-mono">0,1 mg/kg (0,1 mL/kg 1:1.000)</td>
                <td className="py-2.5 px-3 font-mono">2,5 mg</td>
                <td className="py-2.5 px-3">Somente se sem acesso IV/IO; ventilar logo após</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-blue-600">Amiodarona (FV / TVSP)</td>
                <td className="py-2.5 px-3 font-mono font-medium">5 mg/kg IV/IO em bolus</td>
                <td className="py-2.5 px-3 font-mono">300 mg</td>
                <td className="py-2.5 px-3">Pode repetir bolus de 5 mg/kg até 2 vezes</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Lidocaína 2% (sem vaso)</td>
                <td className="py-2.5 px-3 font-mono">1 mg/kg bolus IV/IO</td>
                <td className="py-2.5 px-3 font-mono">100 mg</td>
                <td className="py-2.5 px-3">Alternativa à amiodarona na FV/TV refratária</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Atropina (Bradicardia)</td>
                <td className="py-2.5 px-3 font-mono font-medium">0,02 mg/kg IV/IO</td>
                <td className="py-2.5 px-3 font-mono">0,5 mg (criança) / 1 mg</td>
                <td className="py-2.5 px-3">Dose mínima 0,1 mg (evitar bradicardia paradoxal)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-purple-600">Adenosina — 1ª dose</td>
                <td className="py-2.5 px-3 font-mono font-medium">0,1 mg/kg (TPSV)</td>
                <td className="py-2.5 px-3 font-mono">6 mg</td>
                <td className="py-2.5 px-3">IV/IO em bolus ultrarrápido + flush 5–10 mL SF</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-purple-600">Adenosina — 2ª dose</td>
                <td className="py-2.5 px-3 font-mono font-medium">0,2 mg/kg (TPSV)</td>
                <td className="py-2.5 px-3 font-mono">12 mg</td>
                <td className="py-2.5 px-3">Se TPSV persistir após 1–2 min da 1ª dose</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Bicarbonato de sódio 8,4%</td>
                <td className="py-2.5 px-3 font-mono">1 mEq/kg (1 mL/kg)</td>
                <td className="py-2.5 px-3 font-mono">50 mEq</td>
                <td className="py-2.5 px-3">Em PCR prolongada ou hipercalemia; infusão lenta</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Cloreto de cálcio 10%</td>
                <td className="py-2.5 px-3 font-mono">20 mg/kg (0,2 mL/kg)</td>
                <td className="py-2.5 px-3 font-mono">1 g (10 mL)</td>
                <td className="py-2.5 px-3">Hipocalcemia / intoxicação por bloqueador de Ca</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Sulfato de magnésio 50%</td>
                <td className="py-2.5 px-3 font-mono">25 a 50 mg/kg</td>
                <td className="py-2.5 px-3 font-mono">2 g</td>
                <td className="py-2.5 px-3">Torsades de pointes / asma grave refratária</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Naloxona</td>
                <td className="py-2.5 px-3 font-mono">0,1 mg/kg IV/IO/IM</td>
                <td className="py-2.5 px-3 font-mono">2 mg</td>
                <td className="py-2.5 px-3">Reversão de intoxicação por opioides</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Glicose 10% (Hipoglicemia)</td>
                <td className="py-2.5 px-3 font-mono">5 a 10 mL/kg (0,5–1 g/kg)</td>
                <td className="py-2.5 px-3 font-mono">—</td>
                <td className="py-2.5 px-3">IV/IO lento; reavaliar HGT em 15 minutos</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-emerald-600">Expansão volêmica</td>
                <td className="py-2.5 px-3 font-mono font-medium">10 a 20 mL/kg</td>
                <td className="py-2.5 px-3 font-mono">—</td>
                <td className="py-2.5 px-3">Cristaloide isotônico (SF ou Ringer); reavaliar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Energias de Choque */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Energias — Desfibrilação e Cardioversão Sincronizada
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
            <h3 className="font-bold text-xs uppercase tracking-wide text-rose-600 mb-2">
              Desfibrilação (FV / TV sem pulso)
            </h3>
            <ul className="text-xs space-y-1.5">
              <li>
                <strong>1º Choque:</strong> <span className="font-mono font-bold">2 J/kg</span>
              </li>
              <li>
                <strong>2º Choque:</strong> <span className="font-mono font-bold">4 J/kg</span>
              </li>
              <li>
                <strong>Choques subsequentes:</strong>{' '}
                <span className="font-mono font-bold">≥ 4 J/kg</span> (máx. 10 J/kg ou dose de
                adulto)
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
            <h3 className="font-bold text-xs uppercase tracking-wide text-blue-600 mb-2">
              Cardioversão Sincronizada (TPSV instável / TV com pulso)
            </h3>
            <ul className="text-xs space-y-1.5">
              <li>
                <strong>1ª Dose:</strong>{' '}
                <span className="font-mono font-bold">0,5 a 1 J/kg</span>
              </li>
              <li>
                <strong>2ª Dose (se refratário):</strong>{' '}
                <span className="font-mono font-bold">2 J/kg</span>
              </li>
              <li className="text-[11px] text-slate-500">
                * Sempre acionar o modo SINC do desfibrilador antes do disparo!
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dispositivos de Via Aérea (TOT e Lâmina) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
          Tubo Orotraqueal (TOT) e Lâminas por Faixa Etária
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 px-3">Faixa etária</th>
                <th className="py-2 px-3">TOT sem balonete</th>
                <th className="py-2 px-3">TOT com balonete</th>
                <th className="py-2 px-3">Lâmina laringoscópio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="py-2 px-3 font-sans font-medium">RN (0–28 dias)</td>
                <td className="py-2 px-3">3,0 – 3,5 mm</td>
                <td className="py-2 px-3 font-sans text-slate-400">Geralmente sem cuff</td>
                <td className="py-2 px-3 font-sans">Miller 0 (reta)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-medium">Lactente (1–12 meses)</td>
                <td className="py-2 px-3">3,5 – 4,0 mm</td>
                <td className="py-2 px-3">3,0 – 3,5 mm</td>
                <td className="py-2 px-3 font-sans">Miller 1 (reta)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-medium">1 a 2 anos</td>
                <td className="py-2 px-3">4,0 – 4,5 mm</td>
                <td className="py-2 px-3">3,5 – 4,0 mm</td>
                <td className="py-2 px-3 font-sans">Miller 1 ou Mac 2</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-medium">Pré-escolar (3 a 5 anos)</td>
                <td className="py-2 px-3">4,5 – 5,0 mm</td>
                <td className="py-2 px-3">4,0 – 4,5 mm</td>
                <td className="py-2 px-3 font-sans">Mac 2 ou Miller 2</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-medium">Escolar (6 a 10 anos)</td>
                <td className="py-2 px-3">5,5 – 6,5 mm</td>
                <td className="py-2 px-3">5,0 – 6,0 mm</td>
                <td className="py-2 px-3 font-sans">Mac 2 – 3</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans font-medium">Adolescente (&gt;10 anos)</td>
                <td className="py-2 px-3">≥ 7,0 mm</td>
                <td className="py-2 px-3">6,5 – 7,5 mm</td>
                <td className="py-2 px-3 font-sans">Mac 3</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
          <strong>Fórmulas PALS (&gt;1 ano):</strong>
          <span className="block mt-0.5">
            • <em>Sem balonete:</em> (Idade / 4) + 4
          </span>
          <span className="block">
            • <em>Com balonete:</em> (Idade / 4) + 3,5
          </span>
          <span className="block">
            • <em>Fixação na rima labial (cm):</em> Número do TOT × 3
          </span>
        </div>
      </section>

      {/* Outros Dispositivos */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
          Tamanhos de Outros Dispositivos Pediátricos
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 px-3">Faixa etária</th>
                <th className="py-2 px-2.5">Aspiração (Fr)</th>
                <th className="py-2 px-2.5">Cateter IV (G)</th>
                <th className="py-2 px-2.5">SNG (Fr)</th>
                <th className="py-2 px-2.5">Sonda Vesical (Fr)</th>
                <th className="py-2 px-2.5">Dreno Tórax (Fr)</th>
                <th className="py-2 px-2.5">Máscara Laríngea</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-center">
              <tr>
                <td className="py-2 px-3 font-sans text-left font-medium">RN</td>
                <td>6–8</td>
                <td>22–24</td>
                <td>5–8</td>
                <td>5–8</td>
                <td>10–12</td>
                <td className="font-sans">nº 1</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-left font-medium">Lactente</td>
                <td>8</td>
                <td>22–24</td>
                <td>5–8</td>
                <td>5–8</td>
                <td>10–12</td>
                <td className="font-sans">nº 1,5</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-left font-medium">1–2 anos</td>
                <td>8–10</td>
                <td>20–24</td>
                <td>8–10</td>
                <td>8–10</td>
                <td>16–20</td>
                <td className="font-sans">nº 2</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-left font-medium">Pré-escolar</td>
                <td>10</td>
                <td>18–22</td>
                <td>10</td>
                <td>10</td>
                <td>20–24</td>
                <td className="font-sans">nº 2–2,5</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-left font-medium">Escolar</td>
                <td>10–12</td>
                <td>18–20</td>
                <td>10–12</td>
                <td>10–12</td>
                <td>20–28</td>
                <td className="font-sans">nº 2,5</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-left font-medium">Adolescente</td>
                <td>12–14</td>
                <td>16–20</td>
                <td>12–18</td>
                <td>12–14</td>
                <td>28–32</td>
                <td className="font-sans">nº 3–4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
