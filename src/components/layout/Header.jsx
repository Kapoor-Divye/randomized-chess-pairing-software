import React from 'react';
import { useTournament } from '../../context/TournamentContext';

export default function Header({ onOpenAudit }) {
  const { activeTab, setActiveTab } = useTournament();

  // Navigation tab configuration matching tournament management standards
  const navigationTabs = [
    { id: 'details', label: 'Details', disabled: true },
    { id: 'players', label: 'Player Management', disabled: false },
    { id: 'pairings', label: 'Pairings', disabled: false },
    { id: 'standings', label: 'Standings', disabled: false },
    { id: 'scores', label: 'Score Upload', disabled: false },
    { id: 'prize_mgmt', label: 'Prize Management', disabled: true },
    { id: 'prize_dist', label: 'Prize Distribution', disabled: true },
    { id: 'terms', label: 'Commercial Terms', disabled: true },
  ];

  return (
    <header className="border-b border-[#E8E2D9] bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 pt-7 pb-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-black tracking-tight text-stone-900">
            Tournament
          </h1>
          
          {/* Live cryptographic audit drawer toggle */}
          <button 
            type="button"
            onClick={onOpenAudit}
            className="flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-mono bg-stone-900 text-stone-100 rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CSPRNG Telemetry
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex space-x-7 overflow-x-auto no-scrollbar">
          {navigationTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-stone-900 font-semibold'
                    : tab.disabled
                    ? 'border-transparent text-stone-400 cursor-not-allowed'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}