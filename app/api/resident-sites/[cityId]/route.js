import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { cityId } = await params;
  const tourId = cityId;
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },  // ID is a string (cuid)
  });

  if (!tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }
  return NextResponse.json(tour);
}

export async function DELETE(request, { params }) {
  const { tourId } = params;

  try {
    await prisma.tour.delete({
      where: { id: tourId },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { tourId } = params;
  const body = await request.json();

  try {
    const updatedTour = await prisma.tour.update({
      where: { id: tourId },
      data: body,
    });
    return NextResponse.json(updatedTour, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}
