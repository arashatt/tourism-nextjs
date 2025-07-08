import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

// Disable Next.js body parsing so formidable can handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing form" });
    }

    // Unwrap arrays if fields come as arrays
    const getField = (field) => (Array.isArray(field) ? field[0] : field);

    const name = getField(fields.name);
    const price = parseFloat(getField(fields.price));
    const description = getField(fields.description);
    const title = getField(fields.title);
    const cityId = getField(fields.cityId);

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    let imagePath = null;
    if (imageFile?.filepath) {
      const filePath = imageFile.filepath;
      imagePath = "/uploads/" + path.basename(filePath);
    }

    try {
      const newSite = await prisma.tour.create({
        data: {
          name,
          price,
          description,
          title: description,
          image: imagePath,
          city: {
            connect: { id: cityId },
          },
        },
      });

      return res.status(201).json(newSite);
    } catch (e) {
      console.error("DB error:", e);
      return res.status(500).json({ error: "Database error" });
    }
  });
}
