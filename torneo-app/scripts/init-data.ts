// Script to initialize tournament data in Vercel KV
// Run this once after deploying to set up initial users

import { kv } from '@vercel/kv';
import type { TournamentData } from './lib/types';

const INITIAL_DATA: TournamentData = {
  users: [
    { id: '1', name: 'Juan', birthday: '03-15' },
    { id: '2', name: 'Pedro', birthday: '05-20' },
    { id: '3', name: 'Carlos', birthday: '08-10' },
    { id: '4', name: 'Luis', birthday: '11-05' },
    { id: '5', name: 'Diego', birthday: '02-14' },
    { id: '6', name: 'Matias', birthday: '07-22' },
    { id: '7', name: 'Santi', birthday: '09-30' },
    { id: '8', name: 'Fede', birthday: '12-12' },
  ],
  asados: [],
  participations: [],
  penalties: [],
};

async function initializeData() {
  try {
    console.log('Initializing tournament data...');
    await kv.set('torneo_2025', INITIAL_DATA);
    console.log('✅ Data initialized successfully!');
    console.log('Users created:', INITIAL_DATA.users.map(u => u.name).join(', '));
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    process.exit(1);
  }
}

initializeData();

