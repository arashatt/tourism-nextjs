import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function CityPage({ params }) {
  const { cityId } = await params; // ✅ این باعث رفع خطا می‌شود

  const city = await prisma.city.findUnique({
    where: { id: cityId },
    include: { tours: true },
  });

  if (!city) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">{city.name}</h1>

      {city.image && (
        <div className="w-full h-64 relative rounded-lg overflow-hidden">
          <Image
            src={city.image}
            alt={city.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mt-4">تورهای این شهر</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
<h2 className="text-xl font-semibold mt-4">تورهای شهر {city.name}</h2>
          {city.tours.map((tour) => (
            <li key={tour.id}>{tour.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
