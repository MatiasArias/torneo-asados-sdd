import { NextRequest, NextResponse } from 'next/server';
import { getTournamentData, saveTournamentData } from '@/lib/db';
import { calculateAllPoints } from '@/lib/points';
import type { Penalty } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const data = await getTournamentData();
    return NextResponse.json({ penalties: data.penalties });
  } catch (error) {
    console.error('Error fetching penalties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch penalties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const penalty: Omit<Penalty, 'id'> = body;
    
    const data = await getTournamentData();
    
    const newPenalty: Penalty = {
      ...penalty,
      id: uuidv4(),
    };
    
    data.penalties.push(newPenalty);
    
    // Note: Penalties don't affect participation points calculation
    // They are subtracted separately in rankings
    await saveTournamentData(data);
    
    return NextResponse.json({ success: true, penalty: newPenalty });
  } catch (error) {
    console.error('Error creating penalty:', error);
    return NextResponse.json(
      { error: 'Failed to create penalty' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Penalty ID required' },
        { status: 400 }
      );
    }
    
    const data = await getTournamentData();
    data.penalties = data.penalties.filter(p => p.id !== id);
    
    // Note: Penalties don't affect participation points calculation
    // They are subtracted separately in rankings, so no recalculation needed
    await saveTournamentData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting penalty:', error);
    return NextResponse.json(
      { error: 'Failed to delete penalty' },
      { status: 500 }
    );
  }
}

