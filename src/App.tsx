/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { Tabs, TabType } from './components/Tabs';
import { FormView } from './components/FormView';
import { TableView } from './components/TableView';
import { SinaisVitaisView } from './components/SinaisVitaisView';
import { DosesDispositivosView } from './components/DosesDispositivosView';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { DetailModal } from './components/DetailModal';
import { ConfirmModal } from './components/ConfirmModal';
import { PassagemPlantao, GoogleSheetConfig } from './types';
import {
  loadStoredPassagens,
  saveStoredPassagens,
  loadGoogleSheetConfig,
  saveGoogleSheetConfig,
} from './services/storage';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  setCachedAccessToken,
} from './services/firebaseAuth';
import {
  appendPassagemToSheet,
  syncAllPassagensToSheet,
} from './services/googleDriveSheets';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('form');

  // Handover Records State
  const [passagens, setPassagens] = useState<PassagemPlantao[]>([]);

  // Google Sheet Config State
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() =>
    loadGoogleSheetConfig()
  );

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);

  // Modals
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<PassagemPlantao | null>(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Load initial data
  useEffect(() => {
    const loaded = loadStoredPassagens();
    setPassagens(loaded);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (passagens.length > 0) {
      saveStoredPassagens(passagens);
    }
  }, [passagens]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Login handler
  const handleLoginGoogle = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setCachedAccessToken(result.accessToken);
        setIsDriveModalOpen(true);
      }
    } catch (err) {
      console.error('Falha no login Google:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogoutGoogle = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
  };

  const handleUpdateSheetConfig = (newConfig: GoogleSheetConfig) => {
    setSheetConfig(newConfig);
    saveGoogleSheetConfig(newConfig);
  };

  // Submit new handover record
  const handleCreatePassagem = async (
    recordData: Omit<PassagemPlantao, 'id' | 'submittedAt'>
  ): Promise<PassagemPlantao> => {
    const id = `trr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: PassagemPlantao = {
      ...recordData,
      id,
      submittedAt: new Date().toISOString(),
      syncedToGoogleSheets: false,
      googleSpreadsheetId: sheetConfig.spreadsheetId || undefined,
      googleSpreadsheetUrl: sheetConfig.spreadsheetUrl || undefined,
    };

    // Auto-sync with Google Sheet if linked
    if (accessToken && sheetConfig.spreadsheetId && sheetConfig.autoSync) {
      try {
        await appendPassagemToSheet(accessToken, sheetConfig.spreadsheetId, newRecord);
        newRecord.syncedToGoogleSheets = true;
        handleUpdateSheetConfig({
          ...sheetConfig,
          lastSyncedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Falha no auto-sync com Google Sheets:', err);
      }
    }

    setPassagens((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  // Sync all records with Google Sheets
  const handleSyncWithGoogleDrive = async () => {
    if (!accessToken) {
      handleLoginGoogle();
      return;
    }
    if (!sheetConfig.spreadsheetId) {
      setIsDriveModalOpen(true);
      return;
    }

    setIsSyncingDrive(true);
    try {
      await syncAllPassagensToSheet(accessToken, sheetConfig.spreadsheetId, passagens);
      handleUpdateSheetConfig({
        ...sheetConfig,
        lastSyncedAt: new Date().toISOString(),
      });
      alert(`Sincronização concluída com sucesso! Todos os registros foram enviados para a planilha.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro na sincronização';
      alert(`Falha ao sincronizar: ${msg}`);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Delete single record
  const handleDeleteRecord = (id: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Excluir registro?',
      message: 'Esta passagem de plantão será removida da listagem local.',
      onConfirm: () => {
        setPassagens((prev) => prev.filter((p) => p.id !== id));
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Clear all records
  const handleClearAll = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Excluir todos os registros?',
      message:
        'Atenção: todos os registros salvos nesta sessão serão excluídos da listagem. Se você sincronizou com o Google Drive, eles continuarão salvos na sua planilha do Google Sheets.',
      onConfirm: () => {
        setPassagens([]);
        saveStoredPassagens([]);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Header */}
      <Header
        user={user}
        sheetConfig={sheetConfig}
        onOpenGoogleDriveModal={() => setIsDriveModalOpen(true)}
        onLoginGoogle={handleLoginGoogle}
        isLoggingIn={isLoggingIn}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <Tabs
          activeTab={activeTab}
          onChangeTab={(tab) => {
            if (tab === 'drive') {
              setIsDriveModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          recordCount={passagens.length}
          hasDriveLinked={!!sheetConfig.spreadsheetId}
        />

        {/* Tab Views */}
        {activeTab === 'form' && (
          <FormView
            onSubmit={handleCreatePassagem}
            sheetConfig={sheetConfig}
            onGoToTable={() => setActiveTab('table')}
            onOpenGoogleDriveModal={() => setIsDriveModalOpen(true)}
            isDriveConnected={!!user}
          />
        )}

        {activeTab === 'table' && (
          <TableView
            passagens={passagens}
            sheetConfig={sheetConfig}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
            onOpenGoogleDriveModal={() => setIsDriveModalOpen(true)}
            onSyncWithGoogleDrive={handleSyncWithGoogleDrive}
            isSyncingDrive={isSyncingDrive}
            isDriveConnected={!!user}
            onViewRecordDetail={(rec) => setSelectedRecordDetail(rec)}
          />
        )}

        {activeTab === 'vitais' && <SinaisVitaisView />}

        {activeTab === 'doses' && <DosesDispositivosView />}
      </main>

      {/* Google Drive & Sheets Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        user={user}
        accessToken={accessToken}
        sheetConfig={sheetConfig}
        onUpdateSheetConfig={handleUpdateSheetConfig}
        passagens={passagens}
        onLoginGoogle={handleLoginGoogle}
        onLogoutGoogle={handleLogoutGoogle}
        isLoggingIn={isLoggingIn}
      />

      {/* Record Detail Modal */}
      <DetailModal
        passagem={selectedRecordDetail}
        onClose={() => setSelectedRecordDetail(null)}
      />

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Passagem de Plantão TRR • Time de Resposta Rápida • Hospital SOPAI</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Integração com Google Drive e Google Sheets para compartilhamento em nuvem
        </p>
      </footer>
    </div>
  );
}
