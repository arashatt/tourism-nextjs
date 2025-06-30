import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function NewBookingPage({ searchParams }) {
  const { tourId } = await searchParams;

  if (!tourId) return notFound();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return redirect("/login");

  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: { city: true },
  });

  if (!tour) return notFound();

  async function handleBooking(formData) {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return redirect("/login");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    const date = formData.get("date");

    await prisma.booking.create({
      data: {
        userId: user.id,           // ✅ from database
        tourId: tour.id,
        date: new Date(date),
      },
    });

    revalidatePath(`/cities/${tour.cityId}`);
    redirect(`/cities/${tour.cityId}`);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        رزرو تور: {tour.name}
      </h1>

      <form action={handleBooking} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">تاریخ رزرو</label>
          <input
            type="date"
            name="date"
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          تأیید رزرو
        </button>
      </form>
    </div>
  );
}
