import { NextRequest, NextResponse } from 'next/server';
import { getTournamentData, saveTournamentData } from '@/lib/db';
import { calculateAllPoints } from '@/lib/points';
import type { Asado, Participation } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asado, participations }: { asado: Omit<Asado, 'id'>, participations: Omit<Participation, 'asadoId' | 'points'>[] } = body;
    
    // Get current data
    const data = await getTournamentData();
    
    // Create new asado with ID
    const newAsado: Asado = {
      ...asado,
      id: uuidv4(),
    };
    
    // Create participations with asado ID
    const newParticipations: Participation[] = participations.map(p => ({
      ...p,
      asadoId: newAsado.id,
      points: 0, // Will be calculated
    }));
    
    // Add to data
    data.asados.push(newAsado);
    data.participations.push(...newParticipations);
    
    // Recalculate all points
    const updatedData = calculateAllPoints(data);
    
    // Save
    await saveTournamentData(updatedData);
    
    return NextResponse.json({ success: true, asado: newAsado });
  } catch (error) {
    console.error('Error creating asado:', error);
    return NextResponse.json(
      { error: 'Failed to create asado' },
      { status: 500 }
    );
  }
}

