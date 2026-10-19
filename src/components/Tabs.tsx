import React from 'react';
import { ClipboardEdit, Table, Activity, Pill, Cloud } from 'lucide-react';

export type TabType = 'form' | 'table' | 'vitais' | 'doses' | 'drive';

interface TabsProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  recordCount: number;
  hasDriveLinked: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  activeTab,
  onChangeTab,
  recordCount,
  hasDriveLinked,
}) => {
  const tabs = [
    {
      id: 'form' as TabType,
      label: 'Novo registro',
      icon: ClipboardEdit,
    },
    {
      id: 'table' as TabType,
      label: `Planilha (${recordCount})`,
      icon: Table,
    },
    {
      id: 'drive' as TabType,
      label: 'Google Drive',
      icon: Cloud,
      badge: hasDriveLinked ? 'Ativo' : undefined,
    },
    {
      id: 'vitais' as TabType,
      label: 'Sinais Vitais',
      icon: Activity,
    },
    {
      id: 'doses' as TabType,
      label: 'Doses / PALS',
      icon: Pill,
    },
  ];

  return (
    <nav className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl max-w-5xl mx-auto mb-6 overflow-x-auto border border-slate-300/60 dark:border-slate-700/60 text-xs sm:text-sm font-medium">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-all flex-1 justify-center ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/40 dark:hover:bg-slate-700/40'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'opacity-70'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
