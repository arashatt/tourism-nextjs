import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { prisma } from "@/lib/prisma";   // Make sure this path is correct
import CityForm from "@/components/CityForm"; // Reusable form to add a city
import Link from "next/link";

export default async function AdminCitiesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p className="text-center text-red-600 mt-8">دسترسی غیرمجاز: لطفاً وارد شوید.</p>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return <p className="text-center text-red-600 mt-8">شما اجازه دسترسی به این صفحه را ندارید.</p>;
  }

  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">پنل مدیریت شهرها</h1>

      <CityForm />

      <h2 className="text-2xl font-semibold mt-12 mb-4">شهرهای موجود:</h2>
      <ul className="list-disc list-inside space-y-2">
        {cities.map((city) => (
          <li key={city.id}>
            <Link href={`/cities/${city.id}`} className="text-blue-600 underline">
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
