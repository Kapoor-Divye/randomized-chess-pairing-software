import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import PlayerModal from './PlayerModal';

export default function PlayerList() {
  const { startingRankings, addPlayer, updatePlayer, toggleWithdrawPlayer } = useTournament();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Opens modal for editing an existing record
  const handleEditClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  // Opens modal with cleared form for new participant creation
  const handleAddClick = () => {
    setSelectedPlayer(null);
    setIsModalOpen(true);
  };

  // Persists either newly added or modified player
  const handleSavePlayer = (playerData) => {
    if (selectedPlayer) {
      updatePlayer(playerData);
    } else {
      addPlayer(playerData);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D9]">
      {/* Action Toolbar matching reference layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Players Details</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Initial seeding: sorted monotonically by FIDE rating (descending), unrated sorted lexicographically (A–Z).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            type="button" 
            className="px-4 py-2 bg-amber-400/20 text-amber-900 hover:bg-amber-400/30 font-medium rounded-full text-xs transition-colors"
          >
            Sync Fide Players
          </button>
          <button 
            type="button" 
            className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium rounded-full text-xs transition-colors"
          >
            Print
          </button>
          <button 
            type="button" 
            onClick={handleAddClick}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-full text-xs transition-all shadow-sm"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Starting Rankings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16">S.No</th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">FIDE ID</th>
              <th className="py-3.5 px-4">Gender</th>
              <th className="py-3.5 px-4">Age</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {startingRankings.map((player, index) => {
              const isWithdrawn = player.isWithdrawn;
              return (
                <tr 
                  key={player.id} 
                  className={`transition-colors ${isWithdrawn ? 'bg-stone-50 opacity-45' : 'hover:bg-[#FCFAF7]'}`}
                >
                  <td className="py-3.5 px-4 font-mono text-stone-500 text-xs">{index + 1}</td>
                  <td className="py-3.5 px-4 font-medium text-stone-900">
                    {player.name}
                    {isWithdrawn && (
                      <span className="ml-2 px-2 py-0.5 text-[10px] bg-rose-100 text-rose-700 rounded-full font-bold">
                        Withdrawn
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-600 text-xs">
                    {player.id}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 text-xs">{player.gender}</td>
                  <td className="py-3.5 px-4 text-stone-600 text-xs">{player.age}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 text-xs">
                    {player.rating > 0 ? player.rating : 0}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(player)}
                        className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWithdrawPlayer(player.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                          isWithdrawn
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-amber-400 hover:bg-amber-500 text-stone-900'
                        }`}
                      >
                        {isWithdrawn ? 'Reinstate' : 'Withdraw'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlayer}
        playerData={selectedPlayer}
      />
    </div>
  );
}