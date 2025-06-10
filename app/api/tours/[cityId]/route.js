// app/api/tours/[cityId]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { cityId } = params;
  const tours = await prisma.tour.findMany({
    where: { cityId },
  });
  return NextResponse.json(tours);
}
