import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function MyBookingsPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      tour: {
        select: { id: true, title: true },
      },
    },
  });

  const { newBookingId } = await searchParams;

  async function handleCancelBooking(formData) {
    "use server";

    const bookingId = formData.get("bookingId");

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return redirect("/login");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) return redirect("/login");

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { userId: true },
    });

    if (booking?.userId !== user.id) {
      throw new Error("Unauthorized cancellation attempt");
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/my-bookings");
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">رزروهای من</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-muted-foreground">
          شما هنوز هیچ رزروی انجام نداده‌اید.
        </p>
      ) : (
        <table className="w-full text-right border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">عنوان اقامتگاه</th>
              <th className="border px-4 py-2">تاریخ رزرو</th>
              <th className="border px-4 py-2">تاریخ ثبت</th>
              <th className="border px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className={
                  booking.id === newBookingId
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : ""
                }
              >
                <td className="border px-4 py-2">
                  <Link
                    href={`/resident-sites/${booking.tour.id}`}
                    className="text-blue-600 underline"
                  >
                    {booking.tour.title}
                  </Link>
                </td>
                <td className="border px-4 py-2">
                  {new Date(booking.date).toLocaleDateString("fa-IR")}
                </td>
                <td className="border px-4 py-2">
                  {new Date(booking.createdAt).toLocaleDateString("fa-IR")}
                </td>
                <td className="border px-4 py-2">
                  <form action={handleCancelBooking}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button className="text-red-600 hover:underline">
                      لغو
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
