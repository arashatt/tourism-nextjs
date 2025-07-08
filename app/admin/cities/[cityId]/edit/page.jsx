// app/admin/cities/[cityId]/edit/page.jsx
import EditCityForm from "@/components/EditCityForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditCityPage({ params }) {
  const { cityId } = await params;
  const city = await prisma.city.findUnique({
    where: { id: cityId },
  });

  if (!city) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ویرایش شهر</h1>
        <Link href="/admin/cities" className="text-blue-600 underline">
          بازگشت به لیست شهرها
        </Link>
      </div>
      <EditCityForm city={city} />
    </div>
  );
}

