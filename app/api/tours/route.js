import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { name, price, cityName } = await req.json();

    if (!name || !price || !cityName) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
    }

    // Find city by name
const city = await prisma.city.findFirst({
  where: { name: cityName },
});

if (!city) {
  return NextResponse.json({ error: "شهر پیدا نشد" }, { status: 404 });
}


    const priceFloat = parseFloat(price);
    if (isNaN(priceFloat) || priceFloat <= 0) {
      return NextResponse.json({ error: "قیمت نامعتبر است" }, { status: 400 });
    }

const tour = await prisma.tour.create({
  data: {
    name,
    title: name,          // copy name to title
        price: priceFloat,
        city: {
      connect: { id: city.id }, // Connect existing city by its id
    },

  },
});


    return NextResponse.json(tour, { status: 201 });
  } catch (err) {
    console.error("Error creating tour:", err);
    return NextResponse.json({ error: "خطا در ثبت تور" }, { status: 500 });
  }
}
