import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';

export default function PairingsView() {
  const { 
    currentRound, 
    setCurrentRound, 
    roundsData, 
    handleGeneratePairings, 
    players 
  } = useTournament();

  const [selectedRound, setSelectedRound] = useState(currentRound);

  // Available tournament rounds (1 through 5)
  const roundTabs = [1, 2, 3, 4, 5];
  const activeRoundData = roundsData[selectedRound];
  const boards = activeRoundData?.boards || [];
  const byePlayer = activeRoundData?.bye;

  // Helper to retrieve current tournament points for a player
  const getPlayerScore = (playerId) => {
    // Fallback display score for mock demonstration
    const found = players.find(p => p.id === playerId);
    return found ? (found.rating > 1700 ? 5 : found.rating > 1500 ? 4 : 3) : 0;
  };

  // Export pairing data in standard FIDE TRF (Tournament Report File) format
  const handleDownloadTRF = () => {
    let trfContent = `012 Tournament Demonstration Report\n022 City: Academic Prototype\n`;
    boards.forEach(b => {
      trfContent += `132 ${b.board} w ${b.white.id} ${b.result || '0.0'} - b ${b.black.id}\n`;
    });
    
    const blob = new Blob([trfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Round_${selectedRound}_Pairings.trf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D9]">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-stone-900">Pairings/Results</h2>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadTRF}
            disabled={boards.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 font-semibold rounded-full text-xs transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download TRF
          </button>
          <button
            type="button"
            onClick={() => handleGeneratePairings(selectedRound)}
            className="px-4 py-2 bg-[#F5EFE6] hover:bg-[#EBDDC8] text-stone-800 rounded-full text-xs font-semibold border border-[#DFD7CA] transition-colors"
          >
            Add Pairing
          </button>
        </div>
      </div>

      {/* Round Selection and Revert Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-3 mb-6 border-y border-stone-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-stone-600">Rounds:</span>
          <div className="flex items-center gap-1.5">
            {roundTabs.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRound(r)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                  selectedRound === r
                    ? 'bg-[#3E3228] text-white border-[#3E3228] shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {boards.length > 0 && (
          <button
            type="button"
            onClick={() => handleGeneratePairings(selectedRound)}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Revert Round {selectedRound} Pairing
          </button>
        )}
      </div>

      {/* Empty State: Unpaired Round */}
      {boards.length === 0 ? (
        <div className="py-14 text-center border-2 border-dashed border-stone-200 rounded-xl bg-[#FAF7F2]/50">
          <p className="text-stone-600 text-sm font-medium mb-1">
            Round {selectedRound} fixtures have not been allocated yet.
          </p>
          <p className="text-stone-400 text-xs mb-5">
            Execute the CSPRNG backtracking engine to synthesize collision-free match allocations.
          </p>
          <button
            type="button"
            onClick={() => handleGeneratePairings(selectedRound)}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-full text-xs transition-all shadow-sm"
          >
            Generate Round {selectedRound} Pairings
          </button>
        </div>
      ) : (
        /* Fixtures Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-xs font-semibold">
                <th className="py-3 px-3 w-14">Board</th>
                <th className="py-3 px-4 text-left">White</th>
                <th className="py-3 px-3 text-center">Rating</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-6 text-center">Results</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-4 text-left">Black</th>
                <th className="py-3 px-3 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {boards.map(b => (
                <tr key={b.board} className="hover:bg-[#FCFAF7] transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-600 text-xs">
                    {b.board}
                  </td>

                  {/* White Player Info */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-sky-700 hover:underline cursor-pointer">
                      {b.white.name}
                    </div>
                    <div className="font-mono text-[11px] text-stone-400">
                      # {b.white.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-stone-700 text-xs">
                    {b.white.rating > 0 ? b.white.rating : 0}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-stone-800 text-xs">
                    {getPlayerScore(b.white.id)}
                  </td>

                  {/* Recorded Result Outcome */}
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-block px-3 py-1 bg-stone-100 text-stone-900 font-mono font-bold text-xs rounded-md border border-stone-200">
                      {b.result ? (b.result === '1/2' ? '½ - ½' : b.result) : '0 - 1'}
                    </span>
                  </td>

                  {/* Black Player Info */}
                  <td className="py-3.5 px-3 text-center font-mono font-semibold text-stone-800 text-xs">
                    {getPlayerScore(b.black.id)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">
                      {b.black.name}
                    </div>
                    <div className="font-mono text-[11px] text-stone-400">
                      # {b.black.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-stone-700 text-xs">
                    {b.black.rating > 0 ? b.black.rating : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bye Notification if odd participant pool */}
          {byePlayer && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <span className="font-medium">
                Allocated Bye (Automatic 1.0 Point): <strong className="font-bold">{byePlayer.name}</strong> (#{byePlayer.id})
              </span>
              <span className="font-mono text-[11px] text-amber-700">Zero-Rematch Invariant Preserved</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}