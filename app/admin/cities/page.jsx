import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import { prisma } from "@/lib/prisma";   // Make sure this path is correct
import CityForm from "@/components/CityForm"; // Reusable form to add a city
import DeleteCitiesForm from "@/components/DeleteCityForm"; // Reusable form to add a city
import CityList from "@/components/CityList";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminCitiesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
  return (
    <div className="text-center mt-8">
      <p className="text-destructive mb-4">دسترسی غیرمجاز: لطفاً وارد شوید.</p>
      <Link href="/login" passHref>
<Button asChild>
  <Link href="/login">ورود به صفحه ورود</Link>
</Button>

      </Link>
    </div>
  );
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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">حذف شهرها</h1>
      <DeleteCitiesForm />
    </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">شهرهای موجود:</h2>
<CityList />
    </div>
  );
}
