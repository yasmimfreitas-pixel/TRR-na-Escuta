import React from 'react';
import { Activity, AlertCircle, Heart, Thermometer, Wind } from 'lucide-react';

export const SinaisVitaisView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Referência rápida para pediatria.</strong> Valores alinhados aos parâmetros
          utilizados pela Sociedade Brasileira de Pediatria (SBP). Variações individuais existem e
          devem ser sempre correlacionadas com a história clínica e o exame físico do paciente.
        </div>
      </div>

      {/* FC e FR */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Frequência Cardíaca e Respiratória por Faixa Etária
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3">Faixa etária</th>
                <th className="py-2.5 px-3">FC em repouso (bpm)</th>
                <th className="py-2.5 px-3">FR normal (irpm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-medium">RN (0 a 28 dias)</td>
                <td className="py-2.5 px-3 font-mono">100 – 180 (média 140)</td>
                <td className="py-2.5 px-3 font-mono">30 – 60</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Lactente (1 a 11 meses)</td>
                <td className="py-2.5 px-3 font-mono">100 – 160 (média 120)</td>
                <td className="py-2.5 px-3 font-mono">25 – 40</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">1 a 2 anos</td>
                <td className="py-2.5 px-3 font-mono">80 – 130 (média 110)</td>
                <td className="py-2.5 px-3 font-mono">20 – 30</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Pré-escolar (3 a 5 anos)</td>
                <td className="py-2.5 px-3 font-mono">80 – 120 (média 100)</td>
                <td className="py-2.5 px-3 font-mono">20 – 25</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Escolar (6 a 10 anos)</td>
                <td className="py-2.5 px-3 font-mono">70 – 115 (média 90–100)</td>
                <td className="py-2.5 px-3 font-mono">18 – 25</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Adolescente (&gt;10 anos)</td>
                <td className="py-2.5 px-3 font-mono">60 – 100</td>
                <td className="py-2.5 px-3 font-mono">12 – 20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pressão Arterial */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Pressão Arterial (Valores médios aproximados - Percentil 50)
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 mb-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3">Faixa etária</th>
                <th className="py-2.5 px-3">Sistólica (mmHg)</th>
                <th className="py-2.5 px-3">Diastólica (mmHg)</th>
                <th className="py-2.5 px-3">Hipotensão (PAS mínima PALS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-medium">RN (termo, 0–28 dias)</td>
                <td className="py-2.5 px-3 font-mono">60 – 90</td>
                <td className="py-2.5 px-3 font-mono">30 – 60</td>
                <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">&lt; 60 mmHg</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Lactente (1 a 12 meses)</td>
                <td className="py-2.5 px-3 font-mono">80 – 100</td>
                <td className="py-2.5 px-3 font-mono">55 – 65</td>
                <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">&lt; 70 mmHg</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">1 a 10 anos</td>
                <td className="py-2.5 px-3 font-mono">90 – 110</td>
                <td className="py-2.5 px-3 font-mono">55 – 70</td>
                <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">
                  &lt; 70 + (2 × idade) mmHg
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Escolar (6–10 anos)</td>
                <td className="py-2.5 px-3 font-mono">97 – 112</td>
                <td className="py-2.5 px-3 font-mono">57 – 71</td>
                <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">&lt; 90 mmHg</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium">Adolescente (&gt;10 anos)</td>
                <td className="py-2.5 px-3 font-mono">112 – 128</td>
                <td className="py-2.5 px-3 font-mono">66 – 80</td>
                <td className="py-2.5 px-3 font-mono text-rose-600 font-semibold">&lt; 90 mmHg</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500">
          * A PA pediátrica definitiva depende de idade, sexo e percentil de estatura. Em caso de
          dúvida, consultar tabela completa da SBP.
        </p>
      </section>

      {/* Temperatura e Oximetria */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-500" />
          Saturação de Oxigênio (SpO₂) e Temperatura Axilar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 font-semibold text-xs text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              Oxigenação
            </div>
            <div className="p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span>SpO₂ em ar ambiente ideal:</span>
                <span className="font-bold font-mono text-emerald-600">≥ 94% – 95%</span>
              </div>
              <div className="flex justify-between">
                <span>Hipoxemia leve:</span>
                <span className="font-bold font-mono text-amber-600">90% – 93%</span>
              </div>
              <div className="flex justify-between">
                <span>Hipoxemia grave (Alerta TRR):</span>
                <span className="font-bold font-mono text-rose-600">&lt; 90%</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 font-semibold text-xs text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              Temperatura Axilar
            </div>
            <div className="p-3 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Temperatura normal:</span>
                <span className="font-bold font-mono">36,1 °C – 37,2 °C</span>
              </div>
              <div className="flex justify-between">
                <span>Febrícula:</span>
                <span className="font-bold font-mono text-amber-600">37,3 °C – 37,7 °C</span>
              </div>
              <div className="flex justify-between">
                <span>Febre:</span>
                <span className="font-bold font-mono text-rose-600">≥ 37,8 °C – 38,0 °C</span>
              </div>
              <div className="flex justify-between">
                <span>Hipotermia:</span>
                <span className="font-bold font-mono text-blue-600">&lt; 36,0 °C</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
