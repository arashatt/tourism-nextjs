'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditCityForm({ city }) {
  const [name, setName] = useState(city.name || "");
  const [description, setDescription] = useState(city.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("در حال ارسال...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(`/api/cities/${city.id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      setStatus("✅ شهر با موفقیت ویرایش شد.");
    } else {
      setStatus("❌ خطا در ویرایش شهر.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">نام شهر</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">توضیحات</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="image">تغییر تصویر</Label>
        <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      </div>
      <Button type="submit">ویرایش شهر</Button>
      {status && <p className="text-muted-foreground text-sm">{status}</p>}
    </form>
  );
}
