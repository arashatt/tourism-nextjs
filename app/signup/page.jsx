"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (status === "loading") {
    // Optionally show loading state while session loads
    return <p className="text-center p-4">در حال بارگذاری...</p>;
  }

  if (session?.user) {
    // User is logged in, show message + button to return home
    return (
      <div className="flex min-h-screen items-center justify-center  p-4" dir="rtl">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="font-vazir">شما قبلاً وارد شده‌اید</CardTitle>
            <CardDescription className="font-vazir mb-4">
              برای ثبت‌نام نیازی به ورود مجدد نیست.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              بازگشت به صفحه اصلی
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not logged in, show signup form
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "خطایی رخ داده است");
    } else {
      setSuccess("ثبت‌نام با موفقیت انجام شد! در حال هدایت به صفحه ورود...");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center  p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-vazir">ثبت‌نام</CardTitle>
          <CardDescription className="font-vazir">
            لطفاً نام، ایمیل و رمز عبور خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-red-600 mb-4 text-center">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 mb-4 text-center">{success}</p>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام</Label>
              <Input
                id="name"
                type="text"
                placeholder="نام خود را وارد کنید"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              ثبت‌نام
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
