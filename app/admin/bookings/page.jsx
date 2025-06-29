import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="text-center mt-8">
        <p className="text-destructive mb-4">دسترسی غیرمجاز: لطفاً وارد شوید.</p>
        <Button asChild>
          <Link href="/login">ورود به صفحه ورود</Link>
        </Button>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600 mb-4">شما اجازه دسترسی به این صفحه را ندارید.</p>
      </div>
    );
  }

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      tour: { select: { title: true } },
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">مدیریت رزروها</h1>

      <table className="w-full text-right border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">نام کاربر</th>
            <th className="border px-4 py-2">ایمیل</th>
            <th className="border px-4 py-2">عنوان تور</th>
            <th className="border px-4 py-2">وضعیت</th>
            <th className="border px-4 py-2">تاریخ ثبت</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="border px-4 py-2">{booking.user.name || "بدون نام"}</td>
              <td className="border px-4 py-2">{booking.user.email}</td>
              <td className="border px-4 py-2">{booking.tour.title}</td>
              <td className="border px-4 py-2">{booking.status}</td>
              <td className="border px-4 py-2">{new Date(booking.createdAt).toLocaleDateString("fa-IR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
