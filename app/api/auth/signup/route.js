import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ message: "Name, email, and password are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "Email already registered." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return new Response(
    JSON.stringify({ message: "User created successfully" }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}
