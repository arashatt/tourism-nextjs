import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { tourId } = params;
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  return NextResponse.json(tour);
}
