import { NextRequest, NextResponse } from 'next/server';
import { getTournamentData, saveTournamentData } from '@/lib/db';
import { calculateAllPoints } from '@/lib/points';
import type { Asado, Participation } from '@/lib/types';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const data = await getTournamentData();
    const asado = data.asados.find(a => a.id === id);
    
    if (!asado) {
      return NextResponse.json(
        { error: 'Asado not found' },
        { status: 404 }
      );
    }
    
    const participations = data.participations.filter(p => p.asadoId === id);
    
    return NextResponse.json({ asado, participations });
  } catch (error) {
    console.error('Error fetching asado:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asado' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { asado, participations }: { asado: Asado, participations: Participation[] } = body;
    
    const data = await getTournamentData();
    
    // Update asado
    const asadoIndex = data.asados.findIndex(a => a.id === id);
    if (asadoIndex === -1) {
      return NextResponse.json(
        { error: 'Asado not found' },
        { status: 404 }
      );
    }
    data.asados[asadoIndex] = asado;
    
    // Remove old participations and add new ones
    data.participations = data.participations.filter(p => p.asadoId !== id);
    data.participations.push(...participations.map(p => ({ ...p, points: 0 })));
    
    // Recalculate all points
    const updatedData = calculateAllPoints(data);
    
    // Save
    await saveTournamentData(updatedData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating asado:', error);
    return NextResponse.json(
      { error: 'Failed to update asado' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const data = await getTournamentData();
    
    // Remove asado and its participations
    data.asados = data.asados.filter(a => a.id !== id);
    data.participations = data.participations.filter(p => p.asadoId !== id);
    
    // Recalculate all points after deletion
    const updatedData = calculateAllPoints(data);
    
    await saveTournamentData(updatedData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting asado:', error);
    return NextResponse.json(
      { error: 'Failed to delete asado' },
      { status: 500 }
    );
  }
}

