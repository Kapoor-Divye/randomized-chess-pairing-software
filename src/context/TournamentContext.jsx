import React, { createContext, useContext, useState, useMemo } from 'react';
import { generateStochasticPairings } from '../services/pairingEngine';

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const [activeTab, setActiveTab] = useState('players');
  const [currentRound, setCurrentRound] = useState(1);
  const [auditLogs, setAuditLogs] = useState([]);

  // Initial tournament players matching the reference UI
  const [players, setPlayers] = useState([
    { id: '45027960', name: 'Tushar Kapoor', rating: 1804, gender: 'Male', age: 27, isWithdrawn: false, hadBye: false },
    { id: '531039413', name: 'Abhinav Jaiswal', rating: 1538, gender: 'Male', age: 21, isWithdrawn: false, hadBye: false },
    { id: '531036686', name: 'Mudit K Anand', rating: 0, gender: 'Male', age: 13, isWithdrawn: false, hadBye: false },
    { id: '531036687', name: 'Ankit Pathak', rating: 0, gender: 'Male', age: 22, isWithdrawn: false, hadBye: false },
    { id: '25082007', name: 'Prabhat wardhan', rating: 0, gender: 'Male', age: 18, isWithdrawn: false, hadBye: false },
    { id: '531036689', name: 'Lakshya Sinha', rating: 0, gender: 'Male', age: 11, isWithdrawn: false, hadBye: false },
    { id: '531036690', name: 'Vivaan Amish', rating: 0, gender: 'Male', age: 10, isWithdrawn: false, hadBye: false },
    { id: '531036691', name: 'SURAJ NANDKISHORE GARIA', rating: 0, gender: 'Male', age: 24, isWithdrawn: false, hadBye: false },
    { id: '531036692', name: 'Amanpal Singh', rating: 0, gender: 'Male', age: 18, isWithdrawn: false, hadBye: false },
    { id: '531036693', name: 'Mir Aidan Asif', rating: 0, gender: 'Male', age: 16, isWithdrawn: false, hadBye: false }
  ]);

  // Stores all completed matches: { round, whiteId, blackId, result: '1-0' | '1/2' | '0-1' }
  const [matchHistory, setMatchHistory] = useState([]);

  // Stores board pairings and publish status for each round: { [round]: { boards, bye, isPublished } }
  const [roundsData, setRoundsData] = useState({});

  // Helper to record engine events for the telemetry terminal
  const appendAuditLog = (type, message) => {
    setAuditLogs(prev => [
      ...prev,
      { timestamp: new Date().toLocaleTimeString(), type, message }
    ]);
  };

  // Starting rankings sorting logic:
  // 1. Rated players appear first, sorted by rating in descending order.
  // 2. Unrated players (rating 0) and tied ratings are sorted alphabetically (A-Z).
  const startingRankings = useMemo(() => {
    return [...players].sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });
  }, [players]);

  // Generates new pairings for a given round using CSPRNG and constraint backtracking
  const handleGeneratePairings = (roundNum) => {
    const activePool = players.filter(p => !p.isWithdrawn);

    try {
      const result = generateStochasticPairings(activePool, matchHistory, appendAuditLog);

      const formattedBoards = result.pairings.map((p, idx) => ({
        board: idx + 1,
        white: p.white,
        black: p.black,
        result: null // Unrecorded score initially
      }));

      // Mark the bye recipient so they do not receive another bye in later rounds
      if (result.bye) {
        setPlayers(prev => prev.map(p => p.id === result.bye.id ? { ...p, hadBye: true } : p));
      }

      setRoundsData(prev => ({
        ...prev,
        [roundNum]: {
          boards: formattedBoards,
          bye: result.bye,
          isPublished: false
        }
      }));

      setActiveTab('pairings');
    } catch (err) {
      appendAuditLog('ERROR', err.message);
      alert(err.message);
    }
  };

  // Player management actions
  const addPlayer = (newPlayer) => {
    setPlayers(prev => [...prev, newPlayer]);
  };

  const updatePlayer = (updatedPlayer) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const toggleWithdrawPlayer = (playerId) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, isWithdrawn: !p.isWithdrawn } : p));
  };

  return (
    <TournamentContext.Provider value={{
      activeTab,
      setActiveTab,
      currentRound,
      setCurrentRound,
      players,
      startingRankings,
      addPlayer,
      updatePlayer,
      toggleWithdrawPlayer,
      roundsData,
      setRoundsData,
      matchHistory,
      setMatchHistory,
      handleGeneratePairings,
      auditLogs,
      appendAuditLog
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  return useContext(TournamentContext);
}