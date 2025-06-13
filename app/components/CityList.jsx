"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function CityList() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`);
        if (!res.ok) throw new Error("Failed to fetch cities.");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  if (loading) {
    return <p className="text-center my-8">در حال بارگذاری شهرها...</p>;
  }

  if (error) {
    return <p className="text-center my-8 text-red-600">خطا: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">شهرهای گردشگری</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cities.map((city) => (
          <Link key={city.id} href={`/cities/${city.id}`}>
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <CardContent className="p-0">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <CardTitle className="text-center">{city.name}</CardTitle>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
