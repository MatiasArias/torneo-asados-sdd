// Types based on SPEC.md

export interface User {
  id: string;
  name: string;
  birthday: string; // MM-DD format
}

export interface Asado {
  id: string;
  name: string;
  date: string; // ISO8601
  time: string; // HH:mm
  location: string;
  hostId: string;
  notes?: string;
}

export interface Participation {
  asadoId: string;
  userId: string;
  asador: boolean;
  calificacionAsado?: number; // 1-5, required if asador is true
  comprador: boolean;
  asistio: boolean;
  llegoATiempo: boolean;
  llegoTarde: boolean;
  hosteo: boolean;
  carneEspecial: boolean;
  compraDividida: boolean;
  points: number; // calculated
}

export interface Penalty {
  id: string;
  userId: string;
  points: number; // negative
  reason: string;
  date: string; // ISO8601
  asadoId?: string; // optional link to specific asado
}

export interface TournamentData {
  users: User[];
  asados: Asado[];
  participations: Participation[];
  penalties: Penalty[];
}

// Derived/calculated types (not stored)
export interface UserStats {
  userId: string;
  totalPoints: number;
  asadosAttended: number;
  asadosCooked: number;
  timesHosted: number;
  totalPenalties: number;
}

export interface Ranking extends UserStats {
  position: number;
  user: User;
}

