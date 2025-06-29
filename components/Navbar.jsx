"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
        <a href="/" className="text-xl font-bold">سامانه گردشگری</a>

        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className={`text-sm ${isAdmin ? "text-white" : "text-muted-foreground"}`}>
              خوش آمدید، {session.user.name || "کاربر"}
            </span>
            <Button variant={isAdmin ? "default" : "outline"} onClick={() => signOut()}>
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
