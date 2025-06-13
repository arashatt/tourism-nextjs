// scripts/createAdmin.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "ayda"; // change this!
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: "ayda@example.com" }, // 👈 your admin email
    update: { role: "admin" },              // 👈 if exists, make sure role is admin
    create: {
      name: "ayda",
      email: "ayda@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

