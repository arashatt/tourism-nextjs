import formidable from "formidable";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle multipart/form-data with formidable
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const parsed = await new Promise((resolve, reject) => {
        const form = formidable({
          multiples: false,
          uploadDir,
          keepExtensions: true,
        });
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      const { fields, files } = parsed;

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description || "";

      let image = "";
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const fileName = path.basename(file.filepath);
        image = `/uploads/${fileName}`;
      }

      const city = await prisma.city.create({
        data: {
          name,
          description,
          image,
        },
      });

      return res.status(201).json(city);
    } catch (err) {
      console.error("City creation error:", err);
      return res.status(500).json({ error: "خطا در ثبت شهر" });
    }
  } else if (req.method === "GET") {
    try {
      const cities = await prisma.city.findMany();
      return res.status(200).json(cities);
    } catch (err) {
      console.error("Error fetching cities:", err);
      return res.status(500).json({ error: "خطا در دریافت لیست شهرها" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
