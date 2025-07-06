"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResidentSiteForm() {
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("در حال ارسال...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("cityId", cityId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/resident-sites", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("✅ سایت اقامتی با موفقیت اضافه شد.");
      setName("");
      setPrice("");
      setDescription("");
      setCityId("");
      setImageFile(null);
    } else {
      setStatus("❌ خطا در افزودن سایت اقامتی.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>افزودن سایت اقامتی</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">نام</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">قیمت (تومان)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">توضیحات</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded p-2 w-full h-28"
              required
            />
          </div>

          <div>
            <Label htmlFor="image">تصویر (اختیاری)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <div>
            <Label htmlFor="city">شهر</Label>
            <select
              id="city"
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

          <Button type="submit" className="w-full">
            افزودن سایت اقامتی
          </Button>

          {status && (
            <p className="text-sm text-center mt-2 text-muted-foreground">{status}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
