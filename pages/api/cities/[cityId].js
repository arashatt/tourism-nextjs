import formidable from "formidable";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req, res) {
  // ابتدا سشن را دریافت می‌کنیم
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // نقش کاربر را از دیتابیس می‌گیریم
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { cityId } = req.query;

  if (req.method === "PUT") {
    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        const form = formidable({ multiples: false, uploadDir, keepExtensions: true });
        form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
      });

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description || "";

      let image = undefined;
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        image = `/uploads/${path.basename(file.filepath)}`;
      }

      const data = { name, description };
      if (image) data.image = image;

      const updatedCity = await prisma.city.update({
        where: { id: cityId },
        data,
      });

      return res.status(200).json(updatedCity);
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "خطا در ویرایش شهر" });
    }
  }

  res.setHeader("Allow", ["PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
