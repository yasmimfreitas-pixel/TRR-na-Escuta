export interface AdmissionItem {
  local: string;
  leito: string;
}

export interface PatientAguardando {
  local: string;
  destino: string;
  comunicacoes: string[];
  pendencia: string;
}

export interface PassagemPlantao {
  id: string;
  data: string; // YYYY-MM-DD
  turno: 'Manhã' | 'Tarde' | 'Manhã e Tarde' | 'Noite';
  medico: string;
  // Acionamentos
  spa: number;
  ute: number;
  p5: number;
  p6: number;
  p7: number;
  outros: string;
  reaval: string;
  // Admissões
  admissoes: string; // text representation
  admissoesList: AdmissionItem[];
  // Sala do TRR
  salaEnc: number;
  salaFim: number;
  perm12: number;
  perm12det: string;
  // Destino
  uti: number;
  enf: number;
  transf: number;
  obitos: number;
  // Aguardando destino
  aguardando: 'Sim' | 'Não';
  pacientes: string; // text representation
  pacientesList: PatientAguardando[];
  // Pendências
  pendHas: 'Sim' | 'Não';
  pendDet: string;
  // Segurança
  seg: 'Não há situação crítica' | 'Não' | 'Sim, comunicada diretamente ao próximo médico' | 'Sim, comunicação ainda pendente';
  segDet: string;
  hora: string;
  submittedAt: string;
  // Google Drive & Sheets sync
  syncedToGoogleSheets?: boolean;
  googleSpreadsheetId?: string;
  googleSpreadsheetUrl?: string;
}

export interface GoogleSheetConfig {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  spreadsheetTitle: string;
  lastSyncedAt: string | null;
  autoSync: boolean;
}
