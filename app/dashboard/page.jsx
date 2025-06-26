import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");  // not logged in
  }

  // Read fresh user role from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || user.role !== "admin") {
    redirect("/");  // no admin rights
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/cities">
          <Card className="hover:shadow-xl transition">
            {user.role}
            <CardHeader>
              <CardTitle>Manage Cities</CardTitle>
            </CardHeader>
            <CardContent>View, add, edit, or delete cities.</CardContent>
          </Card>
        </Link>

        <Link href="/admin/tours">
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>Manage Tours</CardTitle>
            </CardHeader>
            <CardContent>View, add, edit, or delete tours.</CardContent>
          </Card>
        </Link>

        <Link href="/admin/bookings">
          <Card className="hover:shadow-xl transition">
            <CardHeader>
              <CardTitle>View Bookings</CardTitle>
            </CardHeader>
            <CardContent>See all bookings by users.</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );

}