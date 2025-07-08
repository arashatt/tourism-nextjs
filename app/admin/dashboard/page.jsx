import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/"); // not logged in
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    redirect("/"); // no admin rights
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">پنل مدیریت</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/admin/cities" className="group">
          <Card className="hover:shadow-xl transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-right">مدیریت شهرها</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-right">
              مشاهده، افزودن، ویرایش یا حذف شهرها
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/resident-sites" className="group">
          <Card className="hover:shadow-xl transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-right">مدیریت اقامتگاه‌ها</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-right">
              مشاهده، افزودن، ویرایش یا حذف اقامتگاه‌ها
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/bookings" className="group">
          <Card className="hover:shadow-xl transition cursor-pointer">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-right">مشاهده رزروها</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-right">
              نمایش تمامی رزروهای کاربران
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
