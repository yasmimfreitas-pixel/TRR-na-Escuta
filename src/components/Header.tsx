import React from 'react';
import { User } from 'firebase/auth';
import { Cloud, CheckCircle2, AlertCircle, Moon, Sun, ExternalLink, Share2 } from 'lucide-react';
import { SOPAI_LOGO_URL } from '../assets/logo';
import { GoogleSheetConfig } from '../types';

interface HeaderProps {
  user: User | null;
  sheetConfig: GoogleSheetConfig;
  onOpenGoogleDriveModal: () => void;
  onLoginGoogle: () => void;
  isLoggingIn: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  sheetConfig,
  onOpenGoogleDriveModal,
  onLoginGoogle,
  isLoggingIn,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 py-3 sm:py-4 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand & Hospital Info */}
        <div className="flex items-center gap-3">
          <div className="relative group shrink-0">
            <img
              src={SOPAI_LOGO_URL}
              alt="Mascote SOPAI - Time de Resposta Rápida"
              className="w-13 h-13 sm:w-15 sm:h-15 object-contain rounded-xl border border-blue-100 dark:border-slate-800 shadow-sm bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-800 dark:to-slate-900 p-0.5 transition-transform hover:scale-105"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Passagem de Plantão <span className="text-blue-600 dark:text-blue-400">— TRR</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Pediatria
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Time de Resposta Rápida • Hospital SOPAI
            </p>
          </div>
        </div>

        {/* Actions & Google Drive Pill */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Google Drive Status Button */}
          {user ? (
            <button
              onClick={onOpenGoogleDriveModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs"
              title="Gerenciar compartilhamento com Google Drive"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[130px] sm:max-w-[160px]">
                {sheetConfig.spreadsheetId ? 'Planilha Drive Ativa' : 'Google Conectado'}
              </span>
              <Share2 className="w-3 h-3 opacity-70 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={onLoginGoogle}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xs disabled:opacity-50"
              title="Conectar sua conta Google para salvar e compartilhar no Google Drive"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
              <span>{isLoggingIn ? 'Conectando...' : 'Conectar Google Drive'}</span>
            </button>
          )}

          {/* Direct Sheets Link if exists */}
          {sheetConfig.spreadsheetUrl && (
            <a
              href={sheetConfig.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Abrir Planilha no Google Sheets"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </a>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
