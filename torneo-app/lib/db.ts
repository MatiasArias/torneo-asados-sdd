// Database access functions for Vercel KV
import { kv } from '@vercel/kv';
import type { TournamentData } from './types';

const TOURNAMENT_KEY = 'torneo_2025';

// Initial data structure
const INITIAL_DATA: TournamentData = {
  users: [
    { id: '1', name: 'Seba', birthday: '03-04' },
    { id: '2', name: 'Renato', birthday: '05-13' },
    { id: '3', name: 'Enzo', birthday: '12-27' },
    { id: '4', name: 'Ignacio', birthday: '12-23' },
    { id: '5', name: 'Emilio', birthday: '07-05' },
    { id: '6', name: 'Juampi', birthday: '12-17' },
    { id: '7', name: 'Roman', birthday: '10-25' },
    { id: '8', name: 'Matias', birthday: '01-19' },
    { id: '9', name: 'Lucas', birthday: '03-21' },
  ],
  asados: [],
  participations: [],
  penalties: [],
};

export async function getTournamentData(): Promise<TournamentData> {
  try {
    const data = await kv.get<TournamentData>(TOURNAMENT_KEY);
    
    // If no data exists, initialize with default data
    if (!data) {
      await kv.set(TOURNAMENT_KEY, INITIAL_DATA);
      return INITIAL_DATA;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    // Return initial data as fallback
    return INITIAL_DATA;
  }
}

export async function saveTournamentData(data: TournamentData): Promise<void> {
  try {
    await kv.set(TOURNAMENT_KEY, data);
  } catch (error) {
    console.error('Error saving tournament data:', error);
    throw error;
  }
}

// Helper function to update specific parts
export async function updateTournamentData(
  updater: (data: TournamentData) => TournamentData
): Promise<TournamentData> {
  const data = await getTournamentData();
  const updatedData = updater(data);
  await saveTournamentData(updatedData);
  return updatedData;
}

