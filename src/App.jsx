import { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';

import Header from './components/layout/Header';
import ActionBanner from './components/layout/ActionBanner';
import PlayerList from './components/players/PlayerList';
import PairingsView from './components/pairings/PairingsView';
import ScoreUploadView from './components/scores/ScoreUploadView';
import StandingsTable from './components/standings/StandingsTable';
import AuditDrawer from './components/audit/AuditDrawer';

function MainLayout() {
  const { activeTab } = useTournament();
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans antialiased text-stone-900 pb-16">
      {/* Top Application Bar */}
      <Header onOpenAudit={() => setIsAuditOpen(true)} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6">
        <ActionBanner />

        {/* Tab Routing */}
        <section className="py-6">
          {activeTab === 'players' && <PlayerList />}
          {activeTab === 'pairings' && <PairingsView />}
          {activeTab === 'scores' && <ScoreUploadView />}
          {activeTab === 'standings' && <StandingsTable />}
        </section>
      </main>

      {/* Live CSPRNG Audit Terminal Modal */}
      <AuditDrawer 
        isOpen={isAuditOpen} 
        onClose={() => setIsAuditOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <TournamentProvider>
      <MainLayout />
    </TournamentProvider>
  );
}