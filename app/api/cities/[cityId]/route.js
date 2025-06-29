// app/api/cities/[cityId]/route.js
import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { cityId } = params;

  try {
    await prisma.city.delete({
      where: { id: cityId },
    });

    return new Response(JSON.stringify({ message: 'deleted' }), { status: 200 });
  } catch (error) {
    console.error('Delete failed:', error);
    return new Response(JSON.stringify({ error: 'Not found or failed' }), { status: 500 });
  }
}

