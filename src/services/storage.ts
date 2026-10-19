import { PassagemPlantao, GoogleSheetConfig } from '../types';
import { SHEET_COLUMNS, passagemToRow } from './googleDriveSheets';

const STORAGE_KEY = 'passagens_trr_records_v1';
const SHEET_CONFIG_KEY = 'passagens_trr_sheet_config_v1';

export const INITIAL_RECORDS: PassagemPlantao[] = [
  {
    id: 'rec-ex-001',
    data: '2026-10-19',
    turno: 'Manhã',
    medico: 'Dra. Yasmim Freitas',
    spa: 3,
    ute: 2,
    p5: 1,
    p6: 0,
    p7: 1,
    outros: 'Centro Cirúrgico (1 acionamento pós-extubação)',
    reaval: '1 (Leito 189, Posto 5 - bronquiolite viral com VNI estável)',
    admissoes: 'Posto 5 - Leito 189 // UTE - Leito 12',
    admissoesList: [
      { local: 'Posto 5', leito: '189' },
      { local: 'UTE', leito: '12' },
    ],
    salaEnc: 2,
    salaFim: 1,
    perm12: 0,
    perm12det: '',
    uti: 1,
    enf: 2,
    transf: 0,
    obitos: 0,
    aguardando: 'Sim',
    pacientes: 'Leito 12 (UTE) → UTI | Com.: Médico da UTI; NIR | Pend.: Vaga solicitada com prioridade 1',
    pacientesList: [
      {
        local: 'Leito 12 (UTE)',
        destino: 'UTI',
        comunicacoes: ['Médico da UTI', 'NIR'],
        pendencia: 'Vaga solicitada com prioridade 1',
      },
    ],
    pendHas: 'Sim',
    pendDet: 'Posto 5 Leito 189: colher gasometria de controle às 15h e avaliar desmame de O2.',
    seg: 'Não há situação crítica',
    segDet: '',
    hora: '13:00',
    submittedAt: '2026-10-19T13:00:00.000Z',
    syncedToGoogleSheets: false,
  },
  {
    id: 'rec-ex-002',
    data: '2026-10-18',
    turno: 'Noite',
    medico: 'Dr. Lucas Silveira',
    spa: 2,
    ute: 1,
    p5: 0,
    p6: 1,
    p7: 0,
    outros: '',
    reaval: '2 (Posto 6 - Leito 210 e Leito 214)',
    admissoes: 'Posto 6 - Leito 210',
    admissoesList: [{ local: 'Posto 6', leito: '210' }],
    salaEnc: 1,
    salaFim: 0,
    perm12: 0,
    perm12det: '',
    uti: 0,
    enf: 1,
    transf: 0,
    obitos: 0,
    aguardando: 'Não',
    pacientes: '',
    pacientesList: [],
    pendHas: 'Não',
    pendDet: '',
    seg: 'Não há situação crítica',
    segDet: '',
    hora: '07:00',
    submittedAt: '2026-10-19T07:00:00.000Z',
    syncedToGoogleSheets: false,
  },
];

export function loadStoredPassagens(): PassagemPlantao[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao carregar registros do localStorage:', err);
    return INITIAL_RECORDS;
  }
}

export function saveStoredPassagens(passagens: PassagemPlantao[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passagens));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

export function loadGoogleSheetConfig(): GoogleSheetConfig {
  try {
    const raw = localStorage.getItem(SHEET_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler config da planilha:', err);
  }
  return {
    spreadsheetId: null,
    spreadsheetUrl: null,
    spreadsheetTitle: 'Passagem de Plantão TRR - SOPAI',
    lastSyncedAt: null,
    autoSync: true,
  };
}

export function saveGoogleSheetConfig(config: GoogleSheetConfig): void {
  try {
    localStorage.setItem(SHEET_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Erro ao salvar config da planilha:', err);
  }
}

function csvEscape(v: unknown): string {
  if (v === undefined || v === null) return '""';
  const str = String(v);
  return '"' + str.replace(/"/g, '""') + '"';
}

export function exportPassagensToCSV(passagens: PassagemPlantao[]): void {
  const header = SHEET_COLUMNS.map(csvEscape).join(',');
  const rows = passagens.map((p) => passagemToRow(p).map(csvEscape).join(','));
  const csvContent = '\uFEFF' + [header, ...rows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `passagem-de-plantao-trr-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function formatRecordToText(r: PassagemPlantao, index?: number): string {
  const lines: string[] = [];
  lines.push(`🏥 PASSAGEM DE PLANTÃO – TRR ${index ? `(#${index})` : ''}`);
  lines.push('━'.repeat(44));
  lines.push(`📅 Data: ${r.data || '—'}   ⏰ Turno: ${r.turno || '—'}`);
  lines.push(`👨‍⚕️ Médico: ${r.medico || '—'}`);
  lines.push('');
  lines.push('🚨 ACIONAMENTOS RECEBIDOS');
  lines.push(
    `  • SPA: ${r.spa ?? 0}  |  UTE: ${r.ute ?? 0}  |  Posto 5: ${r.p5 ?? 0}  |  Posto 6: ${r.p6 ?? 0}  |  Posto 7: ${r.p7 ?? 0}`
  );
  if (r.outros) lines.push(`  • Outros: ${r.outros}`);
  if (r.reaval) lines.push(`  • Reavaliações: ${r.reaval}`);
  lines.push('');
  lines.push('📥 ADMISSÕES NO PLANTÃO');
  lines.push(`  ${r.admissoes || 'Nenhuma admissão no período'}`);
  lines.push('');
  lines.push('🏥 SALA DO TRR');
  lines.push(`  • Encaminhados no plantão: ${r.salaEnc ?? 0}`);
  lines.push(`  • Na sala ao encerramento: ${r.salaFim ?? 0}`);
  lines.push(`  • Pacientes com permanência ≥12h: ${r.perm12 ?? 0}`);
  if (r.perm12det) lines.push(`    Detalhe ≥12h: ${r.perm12det}`);
  lines.push('');
  lines.push('🔄 DESTINO DOS PACIENTES');
  lines.push(
    `  • UTI: ${r.uti ?? 0}  |  Enfermaria: ${r.enf ?? 0}  |  Transf. Externa: ${r.transf ?? 0}  |  Óbitos: ${r.obitos ?? 0}`
  );
  lines.push('');
  lines.push(`⏳ PACIENTES AGUARDANDO DESTINO: ${r.aguardando || 'Não'}`);
  if (r.pacientes) lines.push(`  ${r.pacientes}`);
  lines.push('');
  lines.push(`📌 PENDÊNCIAS PARA PRÓXIMO PLANTÃO: ${r.pendHas || 'Não'}`);
  if (r.pendDet) lines.push(`  ${r.pendDet}`);
  lines.push('');
  lines.push(`🛡️ SEGURANÇA NA PASSAGEM: ${r.seg || 'Não há situação crítica'}`);
  if (r.segDet) lines.push(`  ⚠️ AÇÃO IMEDIATA: ${r.segDet}`);
  lines.push('');
  lines.push(`🕒 Horário do registro: ${r.hora || '—'}`);
  return lines.join('\n');
}

export function exportPassagensToText(passagens: PassagemPlantao[]): void {
  if (passagens.length === 0) return;
  const parts = passagens.map((r, i) =>
    formatRecordToText(r, passagens.length > 1 ? i + 1 : undefined)
  );
  const content = parts.join('\n\n' + '═'.repeat(44) + '\n\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `passagem-de-plantao-trr-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
