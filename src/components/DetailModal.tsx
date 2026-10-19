import React from 'react';
import { X, Calendar, Clock, User, Share2, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PassagemPlantao } from '../types';
import { formatRecordToText } from '../services/storage';

interface DetailModalProps {
  passagem: PassagemPlantao | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ passagem, onClose }) => {
  if (!passagem) return null;

  const handleShareWhatsApp = () => {
    const text = formatRecordToText(passagem);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopy = async () => {
    const text = formatRecordToText(passagem);
    await navigator.clipboard.writeText(text);
    alert('Texto do plantão copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
              Ficha de Passagem de Plantão
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {passagem.medico}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-500" /> {passagem.data}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> {passagem.turno}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-500">Registrado às {passagem.hora}</span>
          </div>

          {/* Acionamentos */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">
              Acionamentos Recebidos
            </h4>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">SPA</span>
                <span className="font-bold font-mono text-sm">{passagem.spa}</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">UTE</span>
                <span className="font-bold font-mono text-sm">{passagem.ute}</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">P5</span>
                <span className="font-bold font-mono text-sm">{passagem.p5}</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">P6</span>
                <span className="font-bold font-mono text-sm">{passagem.p6}</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">P7</span>
                <span className="font-bold font-mono text-sm">{passagem.p7}</span>
              </div>
            </div>
            {passagem.outros && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                <strong>Outros setores:</strong> {passagem.outros}
              </p>
            )}
            {passagem.reaval && (
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                <strong>Reavaliações:</strong> {passagem.reaval}
              </p>
            )}
          </div>

          {/* Admissões */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">
              Admissões no Plantão
            </h4>
            <p className="text-slate-600 dark:text-slate-300">
              {passagem.admissoes || 'Nenhuma admissão informada.'}
            </p>
          </div>

          {/* Sala TRR & Destino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1.5">Sala do TRR</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                <li>• Encaminhados: <strong>{passagem.salaEnc}</strong></li>
                <li>• No encerramento: <strong>{passagem.salaFim}</strong></li>
                <li>• Permanência ≥12h: <strong>{passagem.perm12}</strong></li>
              </ul>
              {passagem.perm12det && (
                <p className="mt-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded">
                  {passagem.perm12det}
                </p>
              )}
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1.5">Destino</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                <li>• Encaminhados à UTI: <strong className="text-blue-600">{passagem.uti}</strong></li>
                <li>• Retorno/Enfermaria: <strong className="text-emerald-600">{passagem.enf}</strong></li>
                <li>• Transferências externas: <strong className="text-amber-600">{passagem.transf}</strong></li>
                <li>• Óbitos durante assistência: <strong className="text-rose-600">{passagem.obitos}</strong></li>
              </ul>
            </div>
          </div>

          {/* Aguardando Destino */}
          {passagem.aguardando === 'Sim' && (
            <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-amber-50/40 dark:bg-amber-950/20">
              <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Pacientes Aguardando Destino
              </h4>
              <p className="text-amber-950 dark:text-amber-200 text-xs">{passagem.pacientes}</p>
            </div>
          )}

          {/* Pendências */}
          {passagem.pendHas === 'Sim' && (
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-3 bg-blue-50/40 dark:bg-blue-950/20">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                Pendências para o Próximo Plantão
              </h4>
              <p className="text-blue-950 dark:text-blue-200 text-xs">{passagem.pendDet}</p>
            </div>
          )}

          {/* Segurança */}
          {passagem.seg !== 'Não há situação crítica' && passagem.seg !== 'Não' && (
            <div className="border border-rose-300 dark:border-rose-900 rounded-lg p-3 bg-rose-50/60 dark:bg-rose-950/40">
              <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Situação Crítica / Segurança do Paciente
              </h4>
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 mb-1">
                {passagem.seg}
              </p>
              <p className="text-rose-950 dark:text-rose-200 text-xs">{passagem.segDet}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Copiar Texto</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
