// app/api/cities/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const cities = await prisma.city.findMany();
  return NextResponse.json(cities);
}
