import { NextResponse } from 'next/server';
import { getTournamentData } from '@/lib/db';

export async function GET() {
  try {
    const data = await getTournamentData();
    return NextResponse.json({ users: data.users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

