"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false); // ✅ Control Popover

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();

    if (!date || !tourId) return;

    const res = await fetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ tourId, date }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const { bookingId } = await res.json();
      router.push(`/my-bookings?newBookingId=${bookingId}`);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">رزرو اقامتگاه</h1>

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">تاریخ رزرو</label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: faIR }) : "تاریخ را انتخاب کنید"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setOpen(false); // ✅ Close after selecting date
                }}
                initialFocus
                locale={faIR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={!date || isPending}
        >
          تأیید رزرو
        </Button>
      </form>
    </div>
  );
}
