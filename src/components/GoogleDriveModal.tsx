import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  Cloud,
  FileSpreadsheet,
  Share2,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  UserCheck,
  Lock,
  Globe,
  Mail,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { GoogleSheetConfig, PassagemPlantao } from '../types';
import {
  findExistingSpreadsheets,
  createGoogleSpreadsheet,
  syncAllPassagensToSheet,
  shareSpreadsheet,
  GoogleDriveFile,
} from '../services/googleDriveSheets';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  accessToken: string | null;
  sheetConfig: GoogleSheetConfig;
  onUpdateSheetConfig: (config: GoogleSheetConfig) => void;
  passagens: PassagemPlantao[];
  onLoginGoogle: () => void;
  onLogoutGoogle: () => void;
  isLoggingIn: boolean;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  user,
  accessToken,
  sheetConfig,
  onUpdateSheetConfig,
  passagens,
  onLoginGoogle,
  onLogoutGoogle,
  isLoggingIn,
}) => {
  const [existingFiles, setExistingFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareRole, setShareRole] = useState<'reader' | 'writer'>('reader');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && accessToken && !sheetConfig.spreadsheetId) {
      loadDriveFiles();
    }
    if (isOpen) {
      setFeedbackMsg(null);
    }
  }, [isOpen, accessToken]);

  const loadDriveFiles = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    try {
      const files = await findExistingSpreadsheets(accessToken);
      setExistingFiles(files);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleCreateNewSheet = async () => {
    if (!accessToken) {
      setFeedbackMsg({
        type: 'error',
        text: 'Por favor, conecte sua conta Google primeiro.',
      });
      return;
    }

    setIsCreatingSheet(true);
    setFeedbackMsg(null);
    try {
      const { spreadsheetId, spreadsheetUrl } = await createGoogleSpreadsheet(
        accessToken,
        'Passagem de Plantão TRR - SOPAI'
      );

      // Sync existing records immediately
      if (passagens.length > 0) {
        await syncAllPassagensToSheet(accessToken, spreadsheetId, passagens);
      }

      onUpdateSheetConfig({
        ...sheetConfig,
        spreadsheetId,
        spreadsheetUrl,
        lastSyncedAt: new Date().toISOString(),
      });

      setFeedbackMsg({
        type: 'success',
        text: 'Planilha criada com sucesso no Google Drive e dados sincronizados!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar planilha no Google Drive.';
      setFeedbackMsg({ type: 'error', text: msg });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleLinkExisting = async (file: GoogleDriveFile) => {
    const url =
      file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`;
    onUpdateSheetConfig({
      ...sheetConfig,
      spreadsheetId: file.id,
      spreadsheetUrl: url,
      spreadsheetTitle: file.name,
      lastSyncedAt: new Date().toISOString(),
    });
    setFeedbackMsg({
      type: 'success',
      text: `Planilha "${file.name}" vinculada com sucesso!`,
    });
  };

  const handleSyncAllNow = async () => {
    if (!accessToken || !sheetConfig.spreadsheetId) return;
    setIsSyncing(true);
    setFeedbackMsg(null);
    try {
      const res = await syncAllPassagensToSheet(
        accessToken,
        sheetConfig.spreadsheetId,
        passagens
      );
      onUpdateSheetConfig({
        ...sheetConfig,
        lastSyncedAt: new Date().toISOString(),
      });
      setFeedbackMsg({
        type: 'success',
        text: `${res.addedCount} registros sincronizados para o Google Sheets com sucesso!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao sincronizar com Google Sheets.';
      setFeedbackMsg({ type: 'error', text: msg });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!sheetConfig.spreadsheetUrl) return;
    try {
      await navigator.clipboard.writeText(sheetConfig.spreadsheetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnableLinkSharing = async () => {
    if (!accessToken || !sheetConfig.spreadsheetId) return;
    setIsSharing(true);
    setFeedbackMsg(null);
    try {
      const { shareLink } = await shareSpreadsheet(accessToken, sheetConfig.spreadsheetId, {
        role: shareRole,
        type: 'anyone',
      });
      onUpdateSheetConfig({
        ...sheetConfig,
        spreadsheetUrl: shareLink,
      });
      setFeedbackMsg({
        type: 'success',
        text: `Link de compartilhamento ativado como "${
          shareRole === 'writer' ? 'Editor' : 'Visualizador'
        }". Toda a equipe com o link pode acessar!`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao atualizar permissão no Google Drive.';
      setFeedbackMsg({ type: 'error', text: msg });
    } finally {
      setIsSharing(false);
    }
  };

  const handleInviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !sheetConfig.spreadsheetId || !inviteEmail.trim()) return;
    setIsSharing(true);
    setFeedbackMsg(null);
    try {
      await shareSpreadsheet(accessToken, sheetConfig.spreadsheetId, {
        role: shareRole,
        type: 'user',
        emailAddress: inviteEmail.trim(),
      });
      setFeedbackMsg({
        type: 'success',
        text: `Convite enviado para ${inviteEmail.trim()} com permissão de ${
          shareRole === 'writer' ? 'Editor' : 'Visualizador'
        }!`,
      });
      setInviteEmail('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao compartilhar com o e-mail.';
      setFeedbackMsg({ type: 'error', text: msg });
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!sheetConfig.spreadsheetUrl) return;
    const msg = `📊 *Planilha de Passagem de Plantão TRR - SOPAI*\nAcesse a planilha compartilhada e atualizada da equipe médica aqui:\n${sheetConfig.spreadsheetUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Google Drive & Google Sheets
              </h3>
              <p className="text-xs text-slate-500">
                Compartilhamento da planilha de passagens do TRR
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Feedback Banner */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-lg text-xs sm:text-sm flex items-start gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Section 1: Google Account Connection */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              1. Conta Google Conectada
            </h4>

            {user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Usuário'}
                      className="w-10 h-10 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      {user.displayName || 'Médico Conectado'}
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[240px]">
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogoutGoogle}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-xs font-medium self-start sm:self-auto transition-colors"
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Conecte sua conta do Google para permitir que o aplicativo crie e compartilhe a
                  planilha oficial no seu Google Drive com permissão segura.
                </p>
                <button
                  onClick={onLoginGoogle}
                  disabled={isLoggingIn}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isLoggingIn ? 'Conectando ao Google...' : 'Fazer login com Google'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Active Spreadsheet or Create */}
          {user && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Planilha no Google Drive
              </h4>

              {sheetConfig.spreadsheetId ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {sheetConfig.spreadsheetTitle}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {sheetConfig.lastSyncedAt
                            ? `Última sincronização: ${new Date(
                                sheetConfig.lastSyncedAt
                              ).toLocaleString('pt-BR')}`
                            : 'Ainda não sincronizada'}
                        </div>
                      </div>
                    </div>

                    <a
                      href={sheetConfig.spreadsheetUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSyncAllNow}
                      disabled={isSyncing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar todos os registros'}</span>
                    </button>

                    <button
                      onClick={handleCreateNewSheet}
                      disabled={isCreatingSheet}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
                    >
                      Criar outra planilha
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Crie uma planilha formatada no seu Google Drive com todas as colunas de
                    plantão (Data, Turno, Médico, SPA, UTE, Postos, Sala TRR, Destino, Pendências e
                    Segurança).
                  </p>

                  <button
                    onClick={handleCreateNewSheet}
                    disabled={isCreatingSheet}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>
                      {isCreatingSheet
                        ? 'Criando e formatando planilha...'
                        : 'Criar Planilha Oficial no Google Drive'}
                    </span>
                  </button>

                  {/* Existing Files on Drive */}
                  {isLoadingFiles ? (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 py-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Buscando planilhas
                      existentes no seu Google Drive...
                    </div>
                  ) : existingFiles.length > 0 ? (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                        Ou vincular planilha já existente:
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {existingFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                          >
                            <span className="font-medium truncate max-w-[260px]">
                              {file.name}
                            </span>
                            <button
                              onClick={() => handleLinkExisting(file)}
                              className="px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100"
                            >
                              Vincular
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Share Options */}
          {user && sheetConfig.spreadsheetId && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Compartilhar com a Equipe
              </h4>

              {/* Public link share */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Compartilhamento por Link
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <label className="text-[11px] text-slate-400">Permissão:</label>
                    <select
                      value={shareRole}
                      onChange={(e) => setShareRole(e.target.value as 'reader' | 'writer')}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                    >
                      <option value="reader">Leitor (Visualizar)</option>
                      <option value="writer">Editor (Pode alterar)</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Ative o link para que qualquer médico ou membro da equipe do hospital com o link
                  possa consultar ou atualizar a planilha diretamente no Google Drive.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEnableLinkSharing}
                    disabled={isSharing}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isSharing ? 'Ativando...' : 'Ativar Link de Compartilhamento'}</span>
                  </button>

                  <button
                    onClick={handleCopyShareLink}
                    className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1 shadow-xs transition-colors"
                    title="Compartilhar link da planilha no WhatsApp da equipe"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Direct email invite */}
              <form onSubmit={handleInviteByEmail} className="space-y-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Convidar médico por e-mail:
                </span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="medico@hospital.com.br"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSharing || !inviteEmail.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 font-medium text-xs hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Convidar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
