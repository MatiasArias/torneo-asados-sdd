// Database access functions for Redis
import { createClient } from 'redis';
import type { TournamentData } from './types';

const TOURNAMENT_KEY = 'torneo_2025';

// Create Redis client
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || '',
    });
    
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }
  
  return redisClient;
}

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
    const client = await getRedisClient();
    const data = await client.get(TOURNAMENT_KEY);
    
    // If no data exists, initialize with default data
    if (!data) {
      await client.set(TOURNAMENT_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    
    return JSON.parse(data) as TournamentData;
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    // Return initial data as fallback
    return INITIAL_DATA;
  }
}

export async function saveTournamentData(data: TournamentData): Promise<void> {
  try {
    const client = await getRedisClient();
    await client.set(TOURNAMENT_KEY, JSON.stringify(data));
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

