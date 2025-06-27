"use client";

import { signIn, signOut, useSession, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import Link from "next/link";

export default function LoginForm() {
  const { data: session, status } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("نام کاربری یا رمز عبور اشتباه است.");
    } else {
      const session = await getSession();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  // 🟡 loading session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center  p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <p>بارگذاری...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🟢 user already logged in
  if (session) {
    return (
      <div className="flex min-h-screen items-center justify-center  p-4" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>خوش آمدید</CardTitle>
            <CardDescription>
              شما به عنوان {session.user?.name} وارد شده‌اید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => signOut()} variant="destructive" className="w-full">
              خروج
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔵 not logged in — show login form
  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-vazir">ورود</CardTitle>
          <CardDescription className="font-vazir">
            نام کاربری یا ایمیل و رمز عبور خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-red-600 mb-4 text-center">{error}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">نام کاربری یا ایمیل</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="نام کاربری یا ایمیل"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              ورود
            </Button>
          </form>
        </CardContent>
        <Link
          href="/signup"
          className="text-blue-600 hover:underline text-sm text-center block mt-4"
        >
          حساب کاربری ندارید؟ ثبت‌نام کنید
        </Link>
      </Card>
    </div>
  );
}
