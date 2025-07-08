"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface City {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export default function CityList() {
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("/api/cities");
        if (!response.ok) {
          throw new Error("خطا در بارگذاری شهرها");
        }
        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError("خطا در دریافت لیست شهرها. لطفاً دوباره تلاش کنید.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  const handleCitySelect = (cityId: string) => {
    router.push(`/cities/${cityId}`);
  };

  return (
    <div className="min-h-screen p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center font-vazir">
          انتخاب شهر برای اقامت
        </h1>
        {error && (
          <Alert variant="destructive" className="mb-6 font-vazir">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <p className="text-center text-gray-600 font-vazir">در حال بارگذاری...</p>
        ) : cities.length === 0 ? (
          <p className="text-center text-gray-600 font-vazir">هیچ شهری یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Card key={city.id} className="font-vazir">
                <CardHeader>
                  <CardTitle className="text-xl font-vazir">{city.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={city.image}
                    alt={`${city.name} تصویر`}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p className="mb-4 text-gray-700 whitespace-pre-wrap font-vazir" dir="rtl">
                    {city.description || "توضیحی برای این شهر ثبت نشده است."}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCitySelect(city.id)}
                      className="w-full font-vazir"
                    >
                      انتخاب اقامتگاه
                    </Button>
                    <Link href={`/admin/cities/${city.id}/edit`} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full font-vazir text-blue-600 border-blue-600"
                      >
                        ویرایش
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
