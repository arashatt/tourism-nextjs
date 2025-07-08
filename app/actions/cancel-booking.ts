// app/actions/cancel-booking.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function cancelBooking(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return redirect("/login");

  const bookingId = formData.get("bookingId") as string;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { userId: true },
  });

  if (booking?.userId !== user?.id) throw new Error("Unauthorized cancellation");

  await prisma.booking.delete({ where: { id: bookingId } });
}

