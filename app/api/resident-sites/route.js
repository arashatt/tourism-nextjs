import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

// Disable default body parsing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ uploadDir, keepExtensions: true, multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable error:", err);
        return resolve(NextResponse.json({ error: "خطا در پردازش فایل" }, { status: 500 }));
      }

      const { name, price, description, cityId } = fields;

      if (!name || !price || !description || !cityId) {
        return resolve(
          NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 })
        );
      }

      const priceFloat = parseFloat(price);
      if (isNaN(priceFloat) || priceFloat <= 0) {
        return resolve(
          NextResponse.json({ error: "قیمت نامعتبر است" }, { status: 400 })
        );
      }

      // Optional image
      const file = files.image;
      let imagePath = null;

      if (file) {
        const filePath = file.filepath || file.path;
        imagePath = "/uploads/" + path.basename(filePath);
      }

      try {
        const residentSite = await prisma.residentSite.create({
          data: {
            name,
            title: name, // or use a separate field if you want
            price: priceFloat,
            description,
            image: imagePath,
            city: {
              connect: { id: cityId },
            },
          },
        });

        return resolve(NextResponse.json(residentSite, { status: 201 }));
      } catch (e) {
        console.error("Error saving resident site:", e);
        return resolve(NextResponse.json({ error: "خطا در ثبت سایت اقامتی" }, { status: 500 }));
      }
    });
  });
}
