// pages/api/cities.js

import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Parse multipart form data
const parseForm = async (req) => {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const name = fields.name;
    let image = "";

    if (files.image) {
      const file = Array.isArray(files.image)
        ? files.image[0]
        : files.image;
      const upload = await cloudinary.uploader.upload(file.filepath, {
        folder: "cities",
      });
      image = upload.secure_url;
    }

    const city = await prisma.city.create({
      data: { name, image },
    });

    return res.status(201).json(city);
  } catch (err) {
    console.error("City creation error:", err);
    return res.status(500).json({ error: "City creation failed" });
  }
}
