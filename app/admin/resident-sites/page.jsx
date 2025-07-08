import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResidentSiteForm from "@/components/ResidentSiteForm";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function AdminResidentSitesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/");
  }

  // Fetch all resident sites (tours) with city info
  const residentSites = await prisma.tour.findMany({
    include: {
      city: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">مدیریت سایت‌های اقامتی</h1>

      <section className="mb-12">
        <ResidentSiteForm />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">فهرست سایت‌های اقامتی</h2>
        {residentSites.length === 0 ? (
          <p>هیچ سایت اقامتی یافت نشد.</p>
        ) : (
          <ul className="space-y-6">
            {residentSites.map((site) => (
              <li
                key={site.id}
                className="flex items-start gap-8 rtl:gap-8 p-4 border rounded"
              >
                
                {site.image && (
                  <Image
                    src={site.image}
                    alt={site.name}
                    width={120}
                    height={80}
    className="object-cover rounded mr-8 rtl:mr-0 rtl:ml-8"
                    
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold">{site.name}</h3>
                  <p>شهر: {site.city?.name || "نامشخص"}</p>
                  <p>قیمت: {site.price.toLocaleString()} تومان</p>
                  {site.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {site.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
