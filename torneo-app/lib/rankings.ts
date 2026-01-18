// Rankings calculation logic
import type { TournamentData, UserStats, Ranking } from './types';

export function calculateUserStats(
  userId: string,
  data: TournamentData
): UserStats {
  const userParticipations = data.participations.filter(p => p.userId === userId);
  const userPenalties = data.penalties.filter(p => p.userId === userId);
  
  const totalPointsFromAsados = userParticipations.reduce(
    (sum, p) => sum + p.points,
    0
  );
  
  const totalPenalties = userPenalties.reduce(
    (sum, p) => sum + p.points,
    0
  );
  
  const totalPoints = totalPointsFromAsados + totalPenalties;
  
  const asadosAttended = userParticipations.filter(p => p.asistio).length;
  const asadosCooked = userParticipations.filter(p => p.asador).length;
  const timesHosted = userParticipations.filter(p => p.hosteo).length;
  
  return {
    userId,
    totalPoints,
    asadosAttended,
    asadosCooked,
    timesHosted,
    totalPenalties: Math.abs(totalPenalties),
  };
}

export function calculateRankings(data: TournamentData): Ranking[] {
  const rankings: Ranking[] = data.users.map(user => {
    const stats = calculateUserStats(user.id, data);
    return {
      ...stats,
      position: 0, // Will be set after sorting
      user,
    };
  });
  
  // Sort by total points (descending), then by tie-breaking rules
  rankings.sort((a, b) => {
    // Primary: Total points
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    
    // Tie-breaker 1: More asados cooked
    if (b.asadosCooked !== a.asadosCooked) {
      return b.asadosCooked - a.asadosCooked;
    }
    
    // Tie-breaker 2: More times hosted
    if (b.timesHosted !== a.timesHosted) {
      return b.timesHosted - a.timesHosted;
    }
    
    // Tie-breaker 3: Fewer penalties
    if (a.totalPenalties !== b.totalPenalties) {
      return a.totalPenalties - b.totalPenalties;
    }
    
    // Final: Alphabetical
    return a.user.name.localeCompare(b.user.name);
  });
  
  // Assign positions
  rankings.forEach((ranking, index) => {
    ranking.position = index + 1;
  });
  
  return rankings;
}

