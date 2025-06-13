import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Adjust path to your next-auth config

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bookingId = params.bookingId;
  const body = await req.formData();
  const method = body.get('_method');

  if (method !== 'DELETE') {
    return NextResponse.json({ error: 'Invalid method' }, { status: 405 });
  }

  // Check if booking belongs to the logged-in user
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true },
  });

  if (!booking || booking.user.email !== session.user.email) {
    return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 403 });
  }

  await prisma.booking.delete({ where: { id: bookingId } });
  return NextResponse.json({ success: true });
}
