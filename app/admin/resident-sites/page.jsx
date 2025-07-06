import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TourForm from "@/components/TourForm"; // Create this next

export default async function AdminToursPage() {
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
        <p className="text-red-600">شما اجازه دسترسی به این صفحه را ندارید.</p>
      </div>
    );
  }

  const tours = await prisma.tour.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">پنل مدیریت تورها</h1>

      <TourForm />

      <h2 className="text-2xl font-semibold mt-12 mb-4">تورهای ثبت‌شده:</h2>
      <ul className="list-disc list-inside space-y-2">
        {tours.map((tour) => (
          <li key={tour.id}>
            <Link href={`/tours/${tour.id}`} className="text-blue-600 underline">
              {tour.title || `تور شماره ${tour.id}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
