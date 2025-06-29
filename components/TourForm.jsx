"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function TourForm() {
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cityId) {
      alert("لطفاً یک شهر انتخاب کنید.");
      return;
    }

    setSubmitting(true);

    try {
const selectedCityName = cities.find(c => c.id === cityId)?.name || "";

const res = await fetch("/api/tours", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, price: parseFloat(price), cityName: selectedCityName }),
});

      if (res.ok) {
        setName("");
        setPrice("");
        setCityId("");
        window.location.reload(); // Refresh the tours list
      } else {
        alert("خطا در ثبت تور");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت تور");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="نام تور"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="قیمت (تومان)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <div>
        <Label>شهر</Label>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          required
          className="border rounded p-2 w-full"
        >
          <option value="" disabled>
            انتخاب شهر
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "در حال ارسال..." : "ثبت تور"}
      </Button>
    </form>
  );
}
