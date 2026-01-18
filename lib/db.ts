// Database access functions - supports Redis or in-memory storage
import Redis from 'ioredis';
import type { TournamentData } from './types';

const TOURNAMENT_KEY = 'torneo_2025';

// Create Redis client (only if REDIS_URL is provided)
let redisClient: Redis | null = null;
let useRedis = false;
let inMemoryData: TournamentData | null = null;

async function getRedisClient() {
  // Only try to use Redis if REDIS_URL is explicitly set
  if (process.env.REDIS_URL && !redisClient && !useRedis) {
    try {
      redisClient = new Redis(process.env.REDIS_URL);
      
      // Test connection
      await redisClient.ping();
      useRedis = true;
      console.log('✓ Connected to Redis');
      
      redisClient.on('error', (err) => {
        console.error('Redis Client Error', err);
        useRedis = false;
        redisClient = null;
      });
    } catch (error) {
      console.log('⚠ Redis not available, using in-memory storage');
      useRedis = false;
      redisClient = null;
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
    
    // Use Redis if available
    if (client && useRedis) {
      const data = await client.get(TOURNAMENT_KEY);
      
      if (!data) {
        await client.set(TOURNAMENT_KEY, JSON.stringify(INITIAL_DATA));
        return INITIAL_DATA;
      }
      
      return JSON.parse(data) as TournamentData;
    }
    
    // Fallback to in-memory storage
    if (!inMemoryData) {
      inMemoryData = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    return JSON.parse(JSON.stringify(inMemoryData));
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    // Return initial data as fallback
    if (!inMemoryData) {
      inMemoryData = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    return JSON.parse(JSON.stringify(inMemoryData));
  }
}

export async function saveTournamentData(data: TournamentData): Promise<void> {
  try {
    const client = await getRedisClient();
    
    // Use Redis if available
    if (client && useRedis) {
      await client.set(TOURNAMENT_KEY, JSON.stringify(data));
    } else {
      // Save to in-memory storage
      inMemoryData = JSON.parse(JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error saving tournament data:', error);
    // Fallback to in-memory
    inMemoryData = JSON.parse(JSON.stringify(data));
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

