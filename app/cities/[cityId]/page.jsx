// app/cities/[cityId]/page.jsx
import Link from 'next/link';

async function getTours(cityId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tours/${cityId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch tours');
  }
  return res.json();
}

export default async function CityToursPage({ params }) {
  const tours = await getTours(params.cityId);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Available Tours</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <Link key={tour.id} href={`/tours/${tour.id}`}>
            <div className="block border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold">{tour.name}</h2>
              <p className="text-lg mt-2">${tour.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
