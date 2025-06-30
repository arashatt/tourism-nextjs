"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.role === "admin";

  return (
    <header
      className={`sticky top-0 z-50 border-b shadow-sm ${
        isAdmin ? "bg-green-600 text-white" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center rtl">
        <Link href="/" className="text-xl font-bold">
          سامانه گردشگری
        </Link>

        {session?.user ? (
          <div className="flex items-center gap-4">
            {/* Admin Links */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-sm hover:underline"
              >
                مدیریت
              </Link>
            )}

            {/* User Links */}
            {!isAdmin && (
              <Link
                href="/my-bookings"
                className={`text-sm ${
                  isAdmin ? "text-white" : "text-muted-foreground"
                } hover:underline`}
              >
                رزروهای من
              </Link>
            )}

            {/* Welcome Text */}
            <span
              className={`text-sm ${
                isAdmin ? "text-white" : "text-muted-foreground"
              }`}
            >
              خوش آمدید، {session.user.name || "کاربر"}
            </span>

            {/* Logout Button */}
            <Button
              variant={isAdmin ? "default" : "outline"}
              onClick={() => signOut()}
            >
              خروج
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => router.push("/login")}>
            ورود
          </Button>
        )}
      </div>
    </header>
  );
}
