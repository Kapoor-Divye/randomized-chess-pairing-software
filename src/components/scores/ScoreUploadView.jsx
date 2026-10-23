import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';

export default function ScoreUploadView() {
  const { 
    currentRound, 
    setCurrentRound, 
    roundsData, 
    setRoundsData, 
    setMatchHistory, 
    setActiveTab, 
    appendAuditLog,
    players 
  } = useTournament();

  const [selectedRound, setSelectedRound] = useState(currentRound);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const roundTabs = [1, 2, 3, 4, 5];
  const activeRoundInfo = roundsData[selectedRound];
  const boards = activeRoundInfo?.boards || [];

  // Helper to obtain current demonstration points for participants
  const getPlayerScore = (playerId) => {
    const found = players.find(p => p.id === playerId);
    return found ? (found.rating > 1700 ? 5 : found.rating > 1500 ? 4 : 3.5) : 0;
  };

  // Handles updating the score state for an individual board fixture
  const handleScoreChange = (boardNumber, scoreValue) => {
    setErrorMessage('');
    setSuccessMessage('');

    setRoundsData(prev => {
      const targetRound = prev[selectedRound];
      if (!targetRound) return prev;

      const updatedBoards = targetRound.boards.map(b => 
        b.board === boardNumber ? { ...b, result: scoreValue } : b
      );

      return {
        ...prev,
        [selectedRound]: {
          ...targetRound,
          boards: updatedBoards
        }
      };
    });
  };

  /**
   * Validation Gate:
   * Asserts that every board in the active round has an unambiguous result assigned.
   * Prevents publishing and rounds progression if any result is pending.
   */
  const handlePublishScores = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (boards.length === 0) {
      setErrorMessage(`No fixtures exist for Round ${selectedRound}. Generate pairings first.`);
      return;
    }

    // Check for unrecorded boards
    const unrecordedBoard = boards.find(b => !b.result);
    if (unrecordedBoard) {
      setErrorMessage(
        `Validation Error: Board ${unrecordedBoard.board} is incomplete. All game outcomes must be recorded before scores can be published or next round pairings generated.`
      );
      return;
    }

    // Record finalized games to the persistent tournament history
    const finalizedMatches = boards.map(b => ({
      round: selectedRound,
      whiteId: b.white.id,
      blackId: b.black.id,
      result: b.result
    }));

    setMatchHistory(prev => {
      // Exclude previous entries of the current round if re-publishing
      const filtered = prev.filter(m => m.round !== selectedRound);
      return [...filtered, ...finalizedMatches];
    });

    // Mark round as officially published
    setRoundsData(prev => ({
      ...prev,
      [selectedRound]: {
        ...prev[selectedRound],
        isPublished: true
      }
    }));

    appendAuditLog(
      "SCORE_PUBLISH", 
      `Round ${selectedRound} scores officially recorded across ${boards.length} fixtures.`
    );

    setSuccessMessage(`Round ${selectedRound} scores published successfully.`);
    
    // Increment the active tournament round if this was the latest round
    if (selectedRound === currentRound && currentRound < 5) {
      setCurrentRound(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D9]">
      {/* View Header and Primary Submission CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Score Update</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Record game outcomes: 1-0 (White victory), ½ (Draw), 0-1 (Black victory).
          </p>
        </div>

        <button
          type="button"
          onClick={handlePublishScores}
          className="px-6 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-full text-xs transition-all shadow-sm"
        >
          Publish Score
        </button>
      </div>

      {/* Validation Feedback Messages */}
      {errorMessage && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
          <button 
            type="button"
            onClick={() => setActiveTab('standings')}
            className="text-emerald-900 underline font-semibold"
          >
            View Live Standings →
          </button>
        </div>
      )}

      {/* Round Selection Tabs */}
      <div className="flex items-center gap-3 py-3 mb-6 border-y border-stone-100">
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

      {/* Empty State */}
      {boards.length === 0 ? (
        <div className="py-12 text-center text-stone-500 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
          No pairings generated for Round {selectedRound}. Switch to the Pairings tab to execute pairings.
        </div>
      ) : (
        /* Board Score Assignment Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-xs font-semibold">
                <th className="py-3 px-3 w-14">Board</th>
                <th className="py-3 px-4 text-left">White</th>
                <th className="py-3 px-3 text-center">Rating</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-6 text-center">
                  <div>Result</div>
                  <div className="text-[10px] text-stone-400 font-normal">
                    Note: Select score outcome per board
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-4 text-left">Black</th>
                <th className="py-3 px-3 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {boards.map(b => (
                <tr key={b.board} className="hover:bg-[#FCFAF7] transition-colors">
                  <td className="py-4 px-3 font-mono font-bold text-stone-600 text-xs">
                    {b.board}
                  </td>

                  {/* White Player */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-sky-700">
                      {b.white.name}
                    </div>
                    <div className="font-mono text-[11px] text-stone-400">
                      # {b.white.id}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-stone-600 text-xs">
                    {b.white.rating > 0 ? b.white.rating : 0}
                  </td>
                  <td className="py-4 px-3 text-center font-mono font-semibold text-stone-800 text-xs">
                    {getPlayerScore(b.white.id)}
                  </td>

                  {/* Tri-state Score Button Controls */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex bg-[#F5EFE6] rounded-xl p-1 gap-1 border border-[#DFD7CA]">
                      {[
                        { label: '1-0', value: '1-0' },
                        { label: '1/2', value: '1/2' },
                        { label: '0-1', value: '0-1' }
                      ].map(option => {
                        const isSelected = b.result === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleScoreChange(b.board, option.value)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#3E3228] text-amber-300 shadow-sm'
                                : 'text-stone-700 hover:bg-[#EBDDC8]'
                            }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Black Player */}
                  <td className="py-4 px-3 text-center font-mono font-semibold text-stone-800 text-xs">
                    {getPlayerScore(b.black.id)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-stone-900">
                      {b.black.name}
                    </div>
                    <div className="font-mono text-[11px] text-stone-400">
                      # {b.black.id}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-stone-600 text-xs">
                    {b.black.rating > 0 ? b.black.rating : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}