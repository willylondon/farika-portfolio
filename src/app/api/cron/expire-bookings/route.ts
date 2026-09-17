import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('cron_secret') || authHeader?.replace('Bearer ', '');

  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'PENDING_PAYMENT',
        expiresAt: {
          lt: new Date()
        }
      }
    });

    for (const booking of expiredBookings) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'EXPIRED' }
        }),
        prisma.class.update({
          where: { id: booking.classId },
          data: { enrolledCount: { decrement: 1 } }
        })
      ]);
    }

    return NextResponse.json({ success: true, count: expiredBookings.length });
  } catch (error) {
    console.error('Error expiring bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
