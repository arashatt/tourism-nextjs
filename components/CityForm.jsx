'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CityForm() {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("در حال ارسال...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/cities", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("✅ شهر با موفقیت اضافه شد.");
      setName("");
      setImageFile(null);
      setDescription("");
    } else {
      setStatus("❌ خطا در افزودن شهر.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>افزودن شهر جدید</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">نام شهر</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              dir="rtl"
            />
          </div>

          <div>
            <Label htmlFor="description">توضیحات شهر</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 resize-y"
              dir="rtl"
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

          <Button type="submit" className="w-full">
            افزودن شهر
          </Button>

          {status && (
            <p className="text-sm text-center mt-2 text-muted-foreground">{status}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
