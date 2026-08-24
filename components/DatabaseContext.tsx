import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Voter, Meeting, TeamMember, Survey, PollResult, BallotReport, 
  VotingStation, CandidateResult, TallyStats 
} from '../types';
import { 
  MOCK_VOTERS, MOCK_MEETINGS, MOCK_TEAMS, SPORTS_LEAGUE_TEAMS, MOCK_SURVEYS, 
  MOCK_POLLS, MOCK_STATIONS, MOCK_CANDIDATES, MOCK_TALLY_STATS 
} from '../constants';
import { useToast } from './Toast';

export interface DatabaseStats {
  votersCount: number;
  meetingsCount: number;
  teamsCount: number;
  surveysCount: number;
  pollsCount: number;
  ballotReportsCount: number;
  lastUpdated: string;
  isCleanState: boolean;
}

interface DatabaseContextType {
  // Collections
  voters: Voter[];
  meetings: Meeting[];
  teams: TeamMember[];
  surveys: Survey[];
  polls: PollResult[];
  ballotReports: BallotReport[];
  votingStations: VotingStation[];
  candidates: CandidateResult[];
  tallyStats: TallyStats;
  
  // Database Operations
  clearDatabase: () => void;
  clearTable: (tableName: 'voters' | 'meetings' | 'teams' | 'surveys' | 'polls' | 'ballots') => void;
  restoreDemoData: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
  
  // Entity Mutators
  setVoters: React.Dispatch<React.SetStateAction<Voter[]>>;
  addVoter: (voter: Omit<Voter, 'id'>) => Voter;
  updateVoter: (id: string, data: Partial<Voter>) => void;
  deleteVoter: (id: string) => void;
  deleteMultipleVoters: (ids: string[]) => void;
  
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, data: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  
  setTeams: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => TeamMember;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  clearTeams: () => void;
  
  setSurveys: React.Dispatch<React.SetStateAction<Survey[]>>;
  addSurvey: (survey: Survey) => void;
  updateSurvey: (id: string, data: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;

  setBallotReports: React.Dispatch<React.SetStateAction<BallotReport[]>>;
  addBallotReport: (report: BallotReport) => void;
  deleteBallotReport: (id: string) => void;

  // Metadata
  dbStats: DatabaseStats;
  isDatabaseEmpty: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Storage keys
const DB_STORAGE_KEYS = {
  VOTERS: 'votando_db_voters_clean',
  MEETINGS: 'votando_db_meetings_clean',
  TEAMS: 'votando_db_teams_clean',
  SURVEYS: 'votando_db_surveys_clean',
  POLLS: 'votando_db_polls_clean',
  BALLOTS: 'votando_db_ballots_clean',
  CLEARED_FLAG: 'votando_db_is_cleared_flag'
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  // Helper to load from localStorage with initial empty default when cleared
  const loadInitial = <T,>(key: string, fallbackEmpty: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(`Error parsing DB key ${key}:`, e);
    }
    return fallbackEmpty;
  };

  // Check if database was explicitly flagged as cleared or initialized
  const [voters, setVoters] = useState<Voter[]>(() => {
    const loaded = loadInitial<Voter[]>(DB_STORAGE_KEYS.VOTERS, []);
    if (!loaded || loaded.length === 0 || (loaded.length <= 4 && loaded[0]?.name === 'João Silva')) {
      return MOCK_VOTERS;
    }
    return loaded;
  });
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const loaded = loadInitial<Meeting[]>(DB_STORAGE_KEYS.MEETINGS, []);
    if (!loaded || loaded.length === 0) {
      return MOCK_MEETINGS;
    }
    return loaded;
  });
  const [teams, setTeams] = useState<TeamMember[]>(() => {
    const loaded = loadInitial<TeamMember[]>(DB_STORAGE_KEYS.TEAMS, []);
    if (!loaded || loaded.length === 0 || (loaded.length === 6 && loaded[0]?.id === 'L1')) {
      return SPORTS_LEAGUE_TEAMS;
    }
    return loaded.map(tm => ({
      ...tm,
      goals: 60,
      achieved: 0
    }));
  });
  const [surveys, setSurveys] = useState<Survey[]>(() => loadInitial<Survey[]>(DB_STORAGE_KEYS.SURVEYS, []));
  const [polls, setPolls] = useState<PollResult[]>(() => loadInitial<PollResult[]>(DB_STORAGE_KEYS.POLLS, []));
  const [ballotReports, setBallotReports] = useState<BallotReport[]>(() => loadInitial<BallotReport[]>(DB_STORAGE_KEYS.BALLOTS, []));
  
  const [votingStations] = useState<VotingStation[]>(MOCK_STATIONS);
  const [candidates] = useState<CandidateResult[]>(MOCK_CANDIDATES);
  const [tallyStats] = useState<TallyStats>(MOCK_TALLY_STATS);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.VOTERS, JSON.stringify(voters));
    } catch (e) {
      console.warn('DB sync error (voters):', e);
    }
  }, [voters]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
    } catch (e) {
      console.warn('DB sync error (meetings):', e);
    }
  }, [meetings]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    } catch (e) {
      console.warn('DB sync error (teams):', e);
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    } catch (e) {
      console.warn('DB sync error (surveys):', e);
    }
  }, [surveys]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.POLLS, JSON.stringify(polls));
    } catch (e) {
      console.warn('DB sync error (polls):', e);
    }
  }, [polls]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEYS.BALLOTS, JSON.stringify(ballotReports));
    } catch (e) {
      console.warn('DB sync error (ballots):', e);
    }
  }, [ballotReports]);

  // Check if all primary collections are empty
  const isDatabaseEmpty = voters.length === 0 && meetings.length === 0 && teams.length === 0 && surveys.length === 0;

  // DB Stats
  const dbStats: DatabaseStats = {
    votersCount: voters.length,
    meetingsCount: meetings.length,
    teamsCount: teams.length,
    surveysCount: surveys.length,
    pollsCount: polls.length,
    ballotReportsCount: ballotReports.length,
    lastUpdated: new Date().toLocaleTimeString('pt-BR'),
    isCleanState: isDatabaseEmpty
  };

  // Complete Database Wipe
  const clearDatabase = () => {
    setVoters([]);
    setMeetings([]);
    setTeams([]);
    setSurveys([]);
    setPolls([]);
    setBallotReports([]);

    try {
      localStorage.setItem(DB_STORAGE_KEYS.VOTERS, JSON.stringify([]));
      localStorage.setItem(DB_STORAGE_KEYS.MEETINGS, JSON.stringify([]));
      localStorage.setItem(DB_STORAGE_KEYS.TEAMS, JSON.stringify([]));
      localStorage.setItem(DB_STORAGE_KEYS.SURVEYS, JSON.stringify([]));
      localStorage.setItem(DB_STORAGE_KEYS.POLLS, JSON.stringify([]));
      localStorage.setItem(DB_STORAGE_KEYS.BALLOTS, JSON.stringify([]));
      localStorage.setItem(DB_STORAGE_KEYS.CLEARED_FLAG, 'true');
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }

    addToast({
      title: 'Banco de Dados Limpo!',
      description: 'Todos os registros de eleitores, reuniões, equipes e pesquisas foram apagados com sucesso.',
      type: 'success'
    });
  };

  // Clear single table
  const clearTable = (tableName: 'voters' | 'meetings' | 'teams' | 'surveys' | 'polls' | 'ballots') => {
    switch (tableName) {
      case 'voters':
        setVoters([]);
        addToast({ title: 'Tabela de Eleitores Limpa', description: 'Todos os eleitores foram removidos.', type: 'info' });
        break;
      case 'meetings':
        setMeetings([]);
        addToast({ title: 'Tabela de Reuniões Limpa', description: 'Todas as reuniões e eventos foram removidos.', type: 'info' });
        break;
      case 'teams':
        setTeams([]);
        addToast({ title: 'Tabela de Equipes Limpa', description: 'Todas as lideranças e integrantes foram removidos.', type: 'info' });
        break;
      case 'surveys':
        setSurveys([]);
        addToast({ title: 'Tabela de Pesquisas Limpa', description: 'Todas as pesquisas foram removidas.', type: 'info' });
        break;
      case 'polls':
        setPolls([]);
        addToast({ title: 'Tabela de Resultados de Pesquisas Limpa', description: 'Histórico de pesquisas apagado.', type: 'info' });
        break;
      case 'ballots':
        setBallotReports([]);
        addToast({ title: 'Boletins de Urna Limpos', description: 'Todos os boletins de apuração foram removidos.', type: 'info' });
        break;
    }
  };

  // Restore sample demo data
  const restoreDemoData = () => {
    setVoters(MOCK_VOTERS);
    setMeetings(MOCK_MEETINGS);
    setTeams(MOCK_TEAMS);
    setSurveys(MOCK_SURVEYS);
    setPolls(MOCK_POLLS);
    setBallotReports([]);
    
    try {
      localStorage.removeItem(DB_STORAGE_KEYS.CLEARED_FLAG);
    } catch (e) {
      console.warn(e);
    }

    addToast({
      title: 'Dados de Demonstração Carregados',
      description: 'O banco de dados foi populado com exemplos estratégicos de campanha.',
      type: 'success'
    });
  };

  // Export full DB backup to JSON file
  const exportDatabaseJSON = () => {
    const backupData = {
      app: 'Votando - Electoral Command Center',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      database: {
        voters,
        meetings,
        teams,
        surveys,
        polls,
        ballotReports
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_votando_campanha_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      title: 'Backup Exportado!',
      description: 'O arquivo JSON completo da campanha foi salvo no seu dispositivo.',
      type: 'success'
    });
  };

  // Import DB backup from JSON file
  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const db = parsed.database || parsed;

      if (Array.isArray(db.voters)) setVoters(db.voters);
      if (Array.isArray(db.meetings)) setMeetings(db.meetings);
      if (Array.isArray(db.teams)) setTeams(db.teams);
      if (Array.isArray(db.surveys)) setSurveys(db.surveys);
      if (Array.isArray(db.polls)) setPolls(db.polls);
      if (Array.isArray(db.ballotReports)) setBallotReports(db.ballotReports);

      addToast({
        title: 'Restauração Concluída!',
        description: 'Os dados do backup foram importados com sucesso para o banco.',
        type: 'success'
      });
      return true;
    } catch (e) {
      console.error('Import error:', e);
      addToast({
        title: 'Falha na Importação',
        description: 'O arquivo selecionado não contém um formato JSON de backup válido.',
        type: 'error'
      });
      return false;
    }
  };

  // Voter Mutators
  const addVoter = (voterData: Omit<Voter, 'id'>): Voter => {
    const newVoter: Voter = {
      ...voterData,
      id: `V${Date.now()}`
    };
    setVoters(prev => [newVoter, ...prev]);
    return newVoter;
  };

  const updateVoter = (id: string, data: Partial<Voter>) => {
    setVoters(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVoter = (id: string) => {
    setVoters(prev => prev.filter(v => v.id !== id));
  };

  const deleteMultipleVoters = (ids: string[]) => {
    const idSet = new Set(ids);
    setVoters(prev => prev.filter(v => !idSet.has(v.id)));
  };

  // Meeting Mutators
  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
  };

  const updateMeeting = (id: string, data: Partial<Meeting>) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  // Team Mutators
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>): TeamMember => {
    const newMember: TeamMember = {
      ...memberData,
      id: `TM${Date.now()}`
    };
    setTeams(prev => [newMember, ...prev]);
    return newMember;
  };

  const updateTeamMember = (id: string, data: Partial<TeamMember>) => {
    setTeams(prev => prev.map(tm => tm.id === id ? { ...tm, ...data } : tm));
  };

  const deleteTeamMember = (id: string) => {
    setTeams(prev => prev.filter(tm => tm.id !== id));
  };

  const clearTeams = () => {
    setTeams([]);
    try {
      localStorage.setItem(DB_STORAGE_KEYS.TEAMS, JSON.stringify([]));
    } catch (e) {
      console.warn('Error clearing teams:', e);
    }
  };

  // Survey Mutators
  const addSurvey = (survey: Survey) => {
    setSurveys(prev => [survey, ...prev]);
  };

  const updateSurvey = (id: string, data: Partial<Survey>) => {
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSurvey = (id: string) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
  };

  // Ballot Mutators
  const addBallotReport = (report: BallotReport) => {
    setBallotReports(prev => [report, ...prev]);
  };

  const deleteBallotReport = (id: string) => {
    setBallotReports(prev => prev.filter(b => b.id !== id));
  };

  return (
    <DatabaseContext.Provider value={{
      voters,
      meetings,
      teams,
      surveys,
      polls,
      ballotReports,
      votingStations,
      candidates,
      tallyStats,
      
      clearDatabase,
      clearTable,
      restoreDemoData,
      exportDatabaseJSON,
      importDatabaseJSON,

      setVoters,
      addVoter,
      updateVoter,
      deleteVoter,
      deleteMultipleVoters,

      setMeetings,
      addMeeting,
      updateMeeting,
      deleteMeeting,

      setTeams,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      clearTeams,

      setSurveys,
      addSurvey,
      updateSurvey,
      deleteSurvey,

      setBallotReports,
      addBallotReport,
      deleteBallotReport,

      dbStats,
      isDatabaseEmpty
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
