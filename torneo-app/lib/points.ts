// Points calculation logic based on SPEC.md
import type { Participation, TournamentData } from './types';

export function calculatePoints(
  participation: Participation,
  allParticipations: Participation[],
  asadoId: string
): number {
  // Get all participants for this asado
  const asadoParticipations = allParticipations.filter(p => p.asadoId === asadoId);
  const attendees = asadoParticipations.filter(p => p.asistio);
  
  // Rule: Minimum 4 attendees or 0 points
  if (attendees.length < 4) {
    return 0;
  }
  
  let points = 0;
  
  // Asar: +3 fijos + (calificación 1-5)
  if (participation.asador) {
    const rating = participation.calificacionAsado || 1;
    points += 3 + rating;
    
    // Carne especial: +1 bonus
    if (participation.carneEspecial) {
      points += 1;
    }
  }
  
  // Comprar: +3 si es solo, +1 si es compartido
  if (participation.comprador) {
    const compradores = asadoParticipations.filter(p => p.comprador);
    if (compradores.length === 1) {
      points += 3; // Solo comprador
    } else {
      points += 1; // Compra dividida
    }
  }
  
  // Asistir: +1
  if (participation.asistio) {
    points += 1;
  }
  
  // Llegar a tiempo: +1
  if (participation.llegoATiempo) {
    points += 1;
  }
  
  // Llegar tarde: +0.5
  if (participation.llegoTarde) {
    points += 0.5;
  }
  
  // Hostear: +3
  if (participation.hosteo) {
    points += 3;
  }
  
  // Cap at 10 points
  return Math.min(points, 10);
}

export function calculateAllPoints(data: TournamentData): TournamentData {
  // Recalculate points for all participations
  const updatedParticipations = data.participations.map(p => ({
    ...p,
    points: calculatePoints(p, data.participations, p.asadoId),
  }));
  
  return {
    ...data,
    participations: updatedParticipations,
  };
}

