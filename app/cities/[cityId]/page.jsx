import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // for routing to booking

export default async function CityPage({ params }) {
  const { cityId } = await params;

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
        <h2 className="text-xl font-semibold mt-4">
          اقامتگاه‌های شهر {city.name}
        </h2>
        <ul className="mt-4 space-y-3">
          {city.tours.map((tour) => (
            <li
              key={tour.id}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{tour.name}</p>
                {/* Add price or description if needed */}
              </div>
              <Link
                href={`/bookings/new?tourId=${tour.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                رزرو
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
