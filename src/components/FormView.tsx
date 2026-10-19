import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  Share2,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Cloud,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  PassagemPlantao,
  AdmissionItem,
  PatientAguardando,
  GoogleSheetConfig,
} from '../types';
import { formatRecordToText } from '../services/storage';

interface FormViewProps {
  onSubmit: (passagem: Omit<PassagemPlantao, 'id' | 'submittedAt'>) => Promise<PassagemPlantao>;
  sheetConfig: GoogleSheetConfig;
  onGoToTable: () => void;
  onOpenGoogleDriveModal: () => void;
  isDriveConnected: boolean;
}

export const FormView: React.FC<FormViewProps> = ({
  onSubmit,
  sheetConfig,
  onGoToTable,
  onOpenGoogleDriveModal,
  isDriveConnected,
}) => {
  // Current date & time defaults
  const today = new Date().toISOString().slice(0, 10);
  const nowTime = new Date().toTimeString().slice(0, 5);

  // Form State
  const [data, setData] = useState(today);
  const [turno, setTurno] = useState<PassagemPlantao['turno']>('Manhã');
  const [medico, setMedico] = useState('');

  // Acionamentos
  const [spa, setSpa] = useState<number>(0);
  const [ute, setUte] = useState<number>(0);
  const [p5, setP5] = useState<number>(0);
  const [p6, setP6] = useState<number>(0);
  const [p7, setP7] = useState<number>(0);
  const [outros, setOutros] = useState('');
  const [reaval, setReaval] = useState('');

  // Admissões
  const [admissoesList, setAdmissoesList] = useState<AdmissionItem[]>([
    { local: 'Posto 5', leito: '' },
  ]);

  // Sala TRR
  const [salaEnc, setSalaEnc] = useState<number>(0);
  const [salaFim, setSalaFim] = useState<number>(0);
  const [perm12, setPerm12] = useState<number>(0);
  const [perm12det, setPerm12det] = useState('');

  // Destino
  const [uti, setUti] = useState<number>(0);
  const [enf, setEnf] = useState<number>(0);
  const [transf, setTransf] = useState<number>(0);
  const [obitos, setObitos] = useState<number>(0);

  // Aguardando destino
  const [aguardando, setAguardando] = useState<'Sim' | 'Não'>('Não');
  const [pacientesList, setPacientesList] = useState<PatientAguardando[]>([]);

  // Pendências
  const [pendHas, setPendHas] = useState<'Sim' | 'Não'>('Não');
  const [pendDet, setPendDet] = useState('');

  // Segurança
  const [seg, setSeg] = useState<PassagemPlantao['seg']>('Não há situação crítica');
  const [segDet, setSegDet] = useState('');
  const [hora, setHora] = useState(nowTime);

  // Status & Post-submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [lastSubmitted, setLastSubmitted] = useState<PassagemPlantao | null>(null);

  // Admission Handlers
  const addAdmission = () => {
    setAdmissoesList([...admissoesList, { local: 'Posto 5', leito: '' }]);
  };

  const removeAdmission = (idx: number) => {
    setAdmissoesList(admissoesList.filter((_, i) => i !== idx));
  };

  const updateAdmission = (idx: number, field: keyof AdmissionItem, value: string) => {
    const updated = [...admissoesList];
    updated[idx] = { ...updated[idx], [field]: value };
    setAdmissoesList(updated);
  };

  // Patient Aguardando Handlers
  const addPatient = () => {
    setPacientesList([
      ...pacientesList,
      { local: '', destino: 'UTI', comunicacoes: [], pendencia: '' },
    ]);
  };

  const removePatient = (idx: number) => {
    setPacientesList(pacientesList.filter((_, i) => i !== idx));
  };

  const updatePatient = (idx: number, field: keyof PatientAguardando, value: any) => {
    const updated = [...pacientesList];
    updated[idx] = { ...updated[idx], [field]: value };
    setPacientesList(updated);
  };

  const toggleComunicacao = (patientIdx: number, item: string) => {
    const current = pacientesList[patientIdx].comunicacoes;
    const next = current.includes(item)
      ? current.filter((c) => c !== item)
      : [...current, item];
    updatePatient(patientIdx, 'comunicacoes', next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medico.trim()) {
      setStatusMsg({ type: 'error', text: 'Por favor, informe o nome do médico de plantão.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    // Build text summary for admissions
    const admissoesText = admissoesList
      .filter((a) => a.leito.trim())
      .map((a) => `${a.local} - Leito ${a.leito.trim()}`)
      .join(' // ');

    // Build text summary for patients awaiting
    const pacientesText =
      aguardando === 'Sim'
        ? pacientesList
            .map(
              (p) =>
                `${p.local || '(sem local)'} → ${p.destino} | Com.: ${
                  p.comunicacoes.join(', ') || '—'
                } | Pend.: ${p.pendencia || '—'}`
            )
            .join(' // ')
        : '';

    try {
      const created = await onSubmit({
        data,
        turno,
        medico: medico.trim(),
        spa: Number(spa) || 0,
        ute: Number(ute) || 0,
        p5: Number(p5) || 0,
        p6: Number(p6) || 0,
        p7: Number(p7) || 0,
        outros: outros.trim(),
        reaval: reaval.trim(),
        admissoes: admissoesText,
        admissoesList,
        salaEnc: Number(salaEnc) || 0,
        salaFim: Number(salaFim) || 0,
        perm12: Number(perm12) || 0,
        perm12det: perm12det.trim(),
        uti: Number(uti) || 0,
        enf: Number(enf) || 0,
        transf: Number(transf) || 0,
        obitos: Number(obitos) || 0,
        aguardando,
        pacientes: pacientesText,
        pacientesList: aguardando === 'Sim' ? pacientesList : [],
        pendHas,
        pendDet: pendHas === 'Sim' ? pendDet.trim() : '',
        seg,
        segDet: seg !== 'Não há situação crítica' && seg !== 'Não' ? segDet.trim() : '',
        hora,
      });

      setLastSubmitted(created);
      setStatusMsg({
        type: 'success',
        text: isDriveConnected && sheetConfig.spreadsheetId
          ? 'Passagem salva com sucesso e sincronizada com a planilha no Google Drive!'
          : 'Passagem de plantão salva com sucesso!',
      });

      // Clear dynamic form fields while preserving doctor & date for convenience
      setSpa(0);
      setUte(0);
      setP5(0);
      setP6(0);
      setP7(0);
      setOutros('');
      setReaval('');
      setAdmissoesList([{ local: 'Posto 5', leito: '' }]);
      setSalaEnc(0);
      setSalaFim(0);
      setPerm12(0);
      setPerm12det('');
      setUti(0);
      setEnf(0);
      setTransf(0);
      setObitos(0);
      setAguardando('Não');
      setPacientesList([]);
      setPendHas('Não');
      setPendDet('');
      setSeg('Não há situação crítica');
      setSegDet('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar passagem de plantão.';
      setStatusMsg({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Share handlers
  const handleShareWhatsApp = () => {
    if (!lastSubmitted) return;
    const text = formatRecordToText(lastSubmitted);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareNative = async () => {
    if (!lastSubmitted) return;
    const text = formatRecordToText(lastSubmitted);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Passagem de Plantão TRR - ${lastSubmitted.data} (${lastSubmitted.turno})`,
          text,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  };

  const handleDownloadText = () => {
    if (!lastSubmitted) return;
    const text = formatRecordToText(lastSubmitted);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passagem-trr-${lastSubmitted.data}-${lastSubmitted.turno}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = async () => {
    if (!lastSubmitted) return;
    const element = document.getElementById('submittedCardPreview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgUrl;
      a.download = `passagem-trr-${lastSubmitted.data}-${lastSubmitted.turno}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Não foi possível gerar a imagem.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Top Notification or Google Drive Sync Tip */}
      {!isDriveConnected && (
        <div className="mb-4 p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
            <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Conecte o <strong>Google Drive</strong> para salvar e compartilhar automaticamente uma
              planilha com toda a equipe do TRR.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenGoogleDriveModal}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            Configurar Google Drive
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Identificação */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              1
            </span>
            Identificação do Plantão
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Data do plantão *
              </label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Turno encerrado *
              </label>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as PassagemPlantao['turno'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Manhã">Manhã (07h às 13h)</option>
                <option value="Tarde">Tarde (13h às 19h)</option>
                <option value="Manhã e Tarde">Manhã e Tarde (07h às 19h - 12h)</option>
                <option value="Noite">Noite (19h às 07h - 12h)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Médico de plantão (Nome completo ou CRM) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex.: Dra. Yasmim Freitas - CRM 12345/CE"
                value={medico}
                onChange={(e) => setMedico(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 2. Acionamentos recebidos */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                2
              </span>
              Acionamentos Recebidos
            </h2>
            <span className="text-[11px] text-slate-400">Informar 0 quando não houver</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                SPA
              </label>
              <input
                type="number"
                min="0"
                value={spa}
                onChange={(e) => setSpa(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                UTE
              </label>
              <input
                type="number"
                min="0"
                value={ute}
                onChange={(e) => setUte(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Posto 5
              </label>
              <input
                type="number"
                min="0"
                value={p5}
                onChange={(e) => setP5(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Posto 6
              </label>
              <input
                type="number"
                min="0"
                value={p6}
                onChange={(e) => setP6(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Posto 7
              </label>
              <input
                type="number"
                min="0"
                value={p7}
                onChange={(e) => setP7(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Outros setores (local e número de acionamentos)
              </label>
              <input
                type="text"
                placeholder="Ex.: Centro Cirúrgico (1), Raio-X (1)"
                value={outros}
                onChange={(e) => setOutros(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Reavaliações sem novo acionamento
              </label>
              <textarea
                rows={2}
                placeholder="Ex.: 1 (Leito 189, posto 5 - bronquiolite viral com VNI)"
                value={reaval}
                onChange={(e) => setReaval(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </section>

        {/* 3. Admissões */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                3
              </span>
              Admissões no Plantão
            </h2>
            <button
              type="button"
              onClick={addAdmission}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar admissão
            </button>
          </div>

          {admissoesList.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">Nenhuma admissão adicionada.</p>
          ) : (
            <div className="space-y-2.5">
              {admissoesList.map((adm, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <select
                    value={adm.local}
                    onChange={(e) => updateAdmission(idx, 'local', e.target.value)}
                    className="w-36 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Posto 3">Posto 3</option>
                    <option value="Posto 5">Posto 5</option>
                    <option value="Posto 6">Posto 6</option>
                    <option value="Posto 7">Posto 7</option>
                    <option value="UTE">UTE</option>
                    <option value="SPA">SPA</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Leito (Ex.: 102, 12, etc.)"
                    value={adm.leito}
                    onChange={(e) => updateAdmission(idx, 'leito', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() => removeAdmission(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-md transition-colors"
                    title="Remover admissão"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Sala do TRR */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              4
            </span>
            Sala do TRR
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Encaminhados à sala no plantão
              </label>
              <input
                type="number"
                min="0"
                value={salaEnc}
                onChange={(e) => setSalaEnc(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Na sala ao encerramento
              </label>
              <input
                type="number"
                min="0"
                value={salaFim}
                onChange={(e) => setSalaFim(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Pacientes com permanência ≥12h
              </label>
              <input
                type="number"
                min="0"
                value={perm12}
                onChange={(e) => setPerm12(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
          </div>

          {perm12 > 0 && (
            <div>
              <label className="block text-xs font-medium text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Detalhes (leito, tempo de permanência e motivo):
              </label>
              <textarea
                rows={2}
                placeholder="Ex.: Leito 02, tempo: 14h, aguardando liberação de leito de isolamento na enfermaria."
                value={perm12det}
                onChange={(e) => setPerm12det(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 text-slate-900 dark:text-white text-sm"
              />
            </div>
          )}
        </section>

        {/* 5. Destino dos pacientes */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              5
            </span>
            Destino dos Pacientes Atendidos
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Encaminhados à UTI
              </label>
              <input
                type="number"
                min="0"
                value={uti}
                onChange={(e) => setUti(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Retorno / Enfermaria
              </label>
              <input
                type="number"
                min="0"
                value={enf}
                onChange={(e) => setEnf(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Transf. externa / Vaga 0
              </label>
              <input
                type="number"
                min="0"
                value={transf}
                onChange={(e) => setTransf(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Óbitos durante assistência
              </label>
              <input
                type="number"
                min="0"
                value={obitos}
                onChange={(e) => setObitos(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm text-center font-semibold"
              />
            </div>
          </div>
        </section>

        {/* 6. Pacientes aguardando destino */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                6
              </span>
              Pacientes Aguardando Destino
            </h2>
            <select
              value={aguardando}
              onChange={(e) => {
                const val = e.target.value as 'Sim' | 'Não';
                setAguardando(val);
                if (val === 'Sim' && pacientesList.length === 0) {
                  addPatient();
                }
              }}
              className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Não">Não há</option>
              <option value="Sim">Sim, há paciente(s)</option>
            </select>
          </div>

          {aguardando === 'Sim' && (
            <div className="space-y-3 pt-1">
              {pacientesList.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50/60 dark:bg-slate-800/40 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => removePatient(pIdx)}
                    className="absolute top-2.5 right-2.5 text-xs text-rose-500 hover:text-rose-700 flex items-center gap-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-16">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                        Local / Leito
                      </label>
                      <input
                        type="text"
                        placeholder="Ex.: Sala TRR - Leito 1"
                        value={pt.local}
                        onChange={(e) => updatePatient(pIdx, 'local', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                        Destino indicado
                      </label>
                      <select
                        value={pt.destino}
                        onChange={(e) => updatePatient(pIdx, 'destino', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="UTI">UTI</option>
                        <option value="Enfermaria">Enfermaria</option>
                        <option value="Transferência externa">Transferência externa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Comunicações já realizadas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Médico da UTI', 'Equipe da enfermaria', 'NIR', 'SAMU'].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md cursor-pointer hover:border-blue-400"
                        >
                          <input
                            type="checkbox"
                            checked={pt.comunicacoes.includes(item)}
                            onChange={() => toggleComunicacao(pIdx, item)}
                            className="rounded text-blue-600"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-0.5">
                      Pendência para transferência / internação (se houver)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Aguardando resultado de RX e PCR de painel viral"
                      value={pt.pendencia}
                      onChange={(e) => updatePatient(pIdx, 'pendencia', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addPatient}
                className="w-full py-2 border border-dashed border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                <Plus className="w-4 h-4" /> Adicionar outro paciente aguardando
              </button>
            </div>
          )}
        </section>

        {/* 7. Pendências para o próximo plantão */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                7
              </span>
              Pendências para o Próximo Plantão
            </h2>
            <select
              value={pendHas}
              onChange={(e) => setPendHas(e.target.value as 'Sim' | 'Não')}
              className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="Não">Não há pendência</option>
              <option value="Sim">Sim, há pendência</option>
            </select>
          </div>

          {pendHas === 'Sim' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Local/leito e o que precisa ser feito pelo colega que assume:
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ex.: Posto 5 Leito 189: checar gasometria pós-ajuste de VNI às 14h. UTE Leito 12: verificar vaga de UTI com o NIR."
                value={pendDet}
                onChange={(e) => setPendDet(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          )}
        </section>

        {/* 8. Segurança na passagem */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              8
            </span>
            Segurança na Passagem de Plantão
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Há situação crítica que exige ação imediata?
              </label>
              <select
                value={seg}
                onChange={(e) => setSeg(e.target.value as PassagemPlantao['seg'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              >
                <option value="Não há situação crítica">Não há situação crítica</option>
                <option value="Sim, comunicada diretamente ao próximo médico">
                  Sim, comunicada verbalmente ao próximo médico
                </option>
                <option value="Sim, comunicação ainda pendente">
                  Sim, comunicação ainda pendente
                </option>
              </select>
            </div>

            {seg !== 'Não há situação crítica' && seg !== 'Não' && (
              <div>
                <label className="block text-xs font-medium text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Detalhes da situação crítica (leito, gravidade, conduta imediata):
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex.: UTE Leito 12 em piora ventilatória franca, risco de intubação orotraqueal nas próximas horas."
                  value={segDet}
                  onChange={(e) => setSegDet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-white text-sm"
                />
              </div>
            )}

            <div className="w-48">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Horário do registro
              </label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Gravando passagem...' : 'Enviar passagem de plantão'}</span>
          </button>

          <button
            type="button"
            onClick={onGoToTable}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Ver Planilha Geral
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </form>

      {/* Post-submit Actions Box */}
      {lastSubmitted && (
        <div className="mt-8 p-5 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Passagem registrada para {lastSubmitted.medico} ({lastSubmitted.turno})
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            O que você deseja fazer com este registro? Você pode compartilhar diretamente por
            WhatsApp, enviar para o Google Drive ou baixar como documento/imagem.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enviar WhatsApp</span>
            </button>

            <button
              onClick={handleShareNative}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar / Copiar</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Baixar Texto</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Baixar Imagem</span>
            </button>

            {sheetConfig.spreadsheetUrl && (
              <a
                href={sheetConfig.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-xs hover:bg-emerald-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Google Sheets</span>
              </a>
            )}
          </div>

          {/* Hidden Card Preview for Image Export */}
          <div className="absolute left-[-9999px] top-0">
            <div
              id="submittedCardPreview"
              className="w-[420px] bg-white text-slate-900 p-5 rounded-lg border border-slate-300 font-sans"
            >
              <div className="bg-blue-600 text-white p-3 rounded-md mb-3 text-center">
                <h4 className="font-bold text-base">Passagem de Plantão – TRR</h4>
                <p className="text-xs opacity-90">Hospital SOPAI • Time de Resposta Rápida</p>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold text-slate-500">Data / Turno:</span>
                  <span className="font-bold text-slate-800">
                    {lastSubmitted.data} ({lastSubmitted.turno})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold text-slate-500">Médico:</span>
                  <span className="font-bold text-slate-800">{lastSubmitted.medico}</span>
                </div>
                <div className="border-b pb-1">
                  <span className="font-semibold text-slate-500 block mb-0.5">Acionamentos:</span>
                  <span className="text-slate-800">
                    SPA: {lastSubmitted.spa} | UTE: {lastSubmitted.ute} | P5: {lastSubmitted.p5} |
                    P6: {lastSubmitted.p6} | P7: {lastSubmitted.p7}
                  </span>
                  {lastSubmitted.outros && (
                    <div className="text-[11px] text-slate-600">Outros: {lastSubmitted.outros}</div>
                  )}
                </div>
                <div className="border-b pb-1">
                  <span className="font-semibold text-slate-500 block mb-0.5">Admissões:</span>
                  <span className="text-slate-800">{lastSubmitted.admissoes || 'Nenhuma'}</span>
                </div>
                <div className="border-b pb-1">
                  <span className="font-semibold text-slate-500 block mb-0.5">Sala TRR:</span>
                  <span className="text-slate-800">
                    Encam.: {lastSubmitted.salaEnc} | No Fim: {lastSubmitted.salaFim} | ≥12h:{' '}
                    {lastSubmitted.perm12}
                  </span>
                </div>
                <div className="border-b pb-1">
                  <span className="font-semibold text-slate-500 block mb-0.5">Destino:</span>
                  <span className="text-slate-800">
                    UTI: {lastSubmitted.uti} | Enf: {lastSubmitted.enf} | Transf:{' '}
                    {lastSubmitted.transf} | Óbitos: {lastSubmitted.obitos}
                  </span>
                </div>
                {lastSubmitted.pendHas === 'Sim' && (
                  <div className="border-b pb-1 bg-amber-50 p-1.5 rounded">
                    <span className="font-semibold text-amber-800 block">Pendências:</span>
                    <span className="text-amber-900">{lastSubmitted.pendDet}</span>
                  </div>
                )}
                {lastSubmitted.seg !== 'Não há situação crítica' && lastSubmitted.seg !== 'Não' && (
                  <div className="border-b pb-1 bg-rose-50 p-1.5 rounded">
                    <span className="font-semibold text-rose-800 block">Ação Crítica:</span>
                    <span className="text-rose-900">{lastSubmitted.segDet}</span>
                  </div>
                )}
                <div className="text-[10px] text-slate-400 text-right pt-1">
                  Registrado às {lastSubmitted.hora}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
