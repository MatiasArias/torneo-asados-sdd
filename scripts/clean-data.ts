// Script to clean/reset tournament data
// Run with: npx tsx scripts/clean-data.ts

import { saveTournamentData } from '../lib/db';
import type { TournamentData } from '../lib/types';

async function cleanData() {
  console.log('🧹 Starting data cleanup...\n');

  // Create empty data structure
  const cleanData: TournamentData = {
    users: [
      { id: '1', name: 'Matias', birthday: '10-20' },
      { id: '2', name: 'Emilio', birthday: '02-15' },
      { id: '3', name: 'Juampi', birthday: '08-12' },
      { id: '4', name: 'Lucas', birthday: '03-25' },
      { id: '5', name: 'Roman', birthday: '07-30' },
      { id: '6', name: 'Enzo', birthday: '11-05' },
      { id: '7', name: 'Ignacio', birthday: '04-18' },
      { id: '8', name: 'Renato', birthday: '09-22' },
      { id: '9', name: 'Seba', birthday: '12-10' },
    ],
    asados: [],
    participations: [],
    penalties: [],
  };

  try {
    await saveTournamentData(cleanData);
    
    console.log('✅ Data cleaned successfully!');
    console.log('\nCurrent state:');
    console.log(`  - Users: ${cleanData.users.length} (kept)`);
    console.log(`  - Asados: ${cleanData.asados.length}`);
    console.log(`  - Participations: ${cleanData.participations.length}`);
    console.log(`  - Penalties: ${cleanData.penalties.length}`);
    console.log('\n🎉 All tournament data has been reset!');
    console.log('   Users remain but all scores are at 0.\n');
  } catch (error) {
    console.error('❌ Error cleaning data:', error);
    process.exit(1);
  }
}

cleanData();

