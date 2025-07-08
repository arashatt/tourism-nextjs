// app/admin/cities/[cityId]/edit/page.jsx
import EditCityForm from "@/components/EditCityForm";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function EditCityPage({ params }) {
  const { cityId } = await params;

  // دریافت سشن کاربر
  const session = await getServerSession(authOptions);

  // اگر کاربر لاگین نکرده باشد، به صفحه ورود ریدایرکت شود
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // گرفتن اطلاعات نقش کاربر از دیتابیس
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  // اگر کاربر ادمین نبود، به صفحه اصلی ریدایرکت شود
  if (user?.role !== "admin") {
    redirect("/");
  }

  // دریافت شهر بر اساس شناسه
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
