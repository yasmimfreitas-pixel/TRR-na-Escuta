import React, { useState } from 'react';
import {
  Search,
  Download,
  Trash2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Share2,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  Cloud,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { PassagemPlantao, GoogleSheetConfig } from '../types';
import { exportPassagensToCSV, exportPassagensToText, formatRecordToText } from '../services/storage';

interface TableViewProps {
  passagens: PassagemPlantao[];
  sheetConfig: GoogleSheetConfig;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onOpenGoogleDriveModal: () => void;
  onSyncWithGoogleDrive: () => Promise<void>;
  isSyncingDrive: boolean;
  isDriveConnected: boolean;
  onViewRecordDetail: (passagem: PassagemPlantao) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  passagens,
  sheetConfig,
  onDeleteRecord,
  onClearAll,
  onOpenGoogleDriveModal,
  onSyncWithGoogleDrive,
  isSyncingDrive,
  isDriveConnected,
  onViewRecordDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurno, setFilterTurno] = useState<string>('todos');
  const [isExportingImage, setIsExportingImage] = useState(false);

  // Filter passagens
  const filtered = passagens.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.medico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.data.includes(searchTerm) ||
      p.admissoes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pacientes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pendDet.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTurno = filterTurno === 'todos' || p.turno === filterTurno;

    return matchesSearch && matchesTurno;
  });

  const handleExportImage = async () => {
    const tableEl = document.getElementById('passagensTableContainer');
    if (!tableEl) return;
    setIsExportingImage(true);
    try {
      const canvas = await html2canvas(tableEl, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `planilha-passagens-trr-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Erro ao exportar imagem:', err);
      alert('Não foi possível exportar a tabela como imagem.');
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleShareRow = (p: PassagemPlantao) => {
    const text = formatRecordToText(p);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-16">
      {/* Google Drive Integration Banner */}
      <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                  Planilha Google Drive
                </h3>
                {sheetConfig.spreadsheetId ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" /> Conectada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <AlertCircle className="w-3 h-3" /> Não vinculada
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sheetConfig.spreadsheetId
                  ? `${sheetConfig.spreadsheetTitle} • Sincronização em nuvem ativa`
                  : 'Vincule ao Google Drive para gerar um link compartilhável e editar no Google Sheets.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {sheetConfig.spreadsheetId ? (
              <>
                <button
                  onClick={onSyncWithGoogleDrive}
                  disabled={isSyncingDrive}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  title="Sincronizar todos os registros agora"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin text-blue-600' : ''}`} />
                  <span>{isSyncingDrive ? 'Sincronizando...' : 'Sincronizar'}</span>
                </button>

                {sheetConfig.spreadsheetUrl && (
                  <a
                    href={sheetConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Google Sheets</span>
                  </a>
                )}

                <button
                  onClick={onOpenGoogleDriveModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium text-xs hover:bg-blue-100 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar Planilha</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenGoogleDriveModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Criar ou Conectar Planilha</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search & Filter */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por médico, leito, data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <select
            value={filterTurno}
            onChange={(e) => setFilterTurno(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          >
            <option value="todos">Todos os turnos</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Manhã e Tarde">Manhã e Tarde</option>
            <option value="Noite">Noite</option>
          </select>

          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-1">
            <strong>{filtered.length}</strong> de {passagens.length}
          </span>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button
            onClick={() => exportPassagensToCSV(filtered)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 transition-colors"
            title="Exportar para Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportPassagensToText(filtered)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 transition-colors"
            title="Exportar como texto formatado"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>TXT</span>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExportingImage || filtered.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
            title="Exportar tabela como imagem"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>{isExportingImage ? 'Gerando...' : 'PNG'}</span>
          </button>

          {passagens.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-medium hover:bg-rose-100 transition-colors"
              title="Excluir todos os registros salvos"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div
        id="passagensTableContainer"
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Turno</th>
                <th className="py-2.5 px-3">Médico</th>
                <th className="py-2.5 px-2.5 text-center" title="SPA">SPA</th>
                <th className="py-2.5 px-2.5 text-center" title="UTE">UTE</th>
                <th className="py-2.5 px-2.5 text-center" title="Posto 5">P5</th>
                <th className="py-2.5 px-2.5 text-center" title="Posto 6">P6</th>
                <th className="py-2.5 px-2.5 text-center" title="Posto 7">P7</th>
                <th className="py-2.5 px-3">Admissões</th>
                <th className="py-2.5 px-3 text-center" title="Sala TRR Encam / Fim">Sala TRR</th>
                <th className="py-2.5 px-3 text-center" title="Destino UTI / Enf / Vaga 0 / Óbito">Destino</th>
                <th className="py-2.5 px-3">Aguardando</th>
                <th className="py-2.5 px-3">Pendências</th>
                <th className="py-2.5 px-3">Segurança</th>
                <th className="py-2.5 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-12 text-center text-slate-400">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const hasCrit = r.seg !== 'Não há situação crítica' && r.seg !== 'Não';
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        hasCrit ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                        {r.data}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {r.turno}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200 max-w-[160px] truncate">
                        {r.medico}
                      </td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{r.spa}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{r.ute}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{r.p5}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{r.p6}</td>
                      <td className="py-2.5 px-2.5 text-center font-mono">{r.p7}</td>
                      <td className="py-2.5 px-3 max-w-[150px] truncate text-slate-600 dark:text-slate-300">
                        {r.admissoes || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                        {r.salaEnc} / {r.salaFim}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono">
                        <span className="text-blue-600 font-bold">{r.uti}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-emerald-600">{r.enf}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-amber-600">{r.transf}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-rose-600">{r.obitos}</span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[140px] truncate text-slate-600 dark:text-slate-300">
                        {r.aguardando === 'Sim' ? (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            {r.pacientes || 'Sim'}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2.5 px-3 max-w-[160px] truncate text-slate-600 dark:text-slate-300">
                        {r.pendHas === 'Sim' ? (
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {r.pendDet || 'Sim'}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {hasCrit ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                            Ação imediata
                          </span>
                        ) : (
                          <span className="text-slate-400">Estável</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewRecordDetail(r)}
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Ver ficha completa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleShareRow(r)}
                            className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Compartilhar por WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRecord(r.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Excluir este registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
