import { NextRequest, NextResponse } from 'next/server';
import { getTournamentData, saveTournamentData } from '@/lib/db';

const ADMIN_CODE = '20182024';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    // Verify admin code
    if (code !== ADMIN_CODE) {
      return NextResponse.json(
        { error: 'Invalid admin code' },
        { status: 403 }
      );
    }

    // Get current data (to preserve users)
    const currentData = await getTournamentData();

    // Reset data but keep users
    const cleanData = {
      users: currentData.users,
      asados: [],
      participations: [],
      penalties: [],
    };

    await saveTournamentData(cleanData);

    return NextResponse.json({
      success: true,
      message: 'Data cleaned successfully',
      stats: {
        users: cleanData.users.length,
        asados: cleanData.asados.length,
        participations: cleanData.participations.length,
        penalties: cleanData.penalties.length,
      },
    });
  } catch (error) {
    console.error('Error cleaning data:', error);
    return NextResponse.json(
      { error: 'Failed to clean data' },
      { status: 500 }
    );
  }
}

