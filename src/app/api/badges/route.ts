import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { badges } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: { message: 'Wallet address is required' } },
        { status: 400 }
      );
    }

    const userBadges = await db
      .select()
      .from(badges)
      .where(eq(badges.walletAddress, walletAddress))
      .orderBy(badges.earnedAt);

    return NextResponse.json({
      success: true,
      data: userBadges,
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to fetch badges', details: error },
      },
      { status: 500 }
    );
  }
}
