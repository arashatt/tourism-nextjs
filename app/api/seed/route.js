import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  const hashed = await bcrypt.hash("secret", 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin",
      password: hashed,
    },
  });

  return NextResponse.json({ success: true });
}

