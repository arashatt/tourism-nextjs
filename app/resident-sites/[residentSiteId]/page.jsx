"use client";

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ResidentSitePage({ params }) {
  const { residentSiteId } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [residentSite, setResidentSite] = useState(null);

  useEffect(() => {
    // Fetch resident site details
    fetch(`/api/resident-sites/${residentSiteId}`)
      .then((res) => res.json())
      .then(setResidentSite);
  }, [residentSiteId]);

  const handleBooking = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        residentSiteId,
        date: startDate,
        userId: session.user.id,
      }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      // You can handle errors here
      alert('خطا در ثبت رزرو');
    }
  };

  if (!residentSite) return <p>در حال بارگذاری...</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">{residentSite.name}</h1>
      <p className="mb-4">{residentSite.description}</p>
      {residentSite.image && (
        <img src={residentSite.image} alt={residentSite.name} className="mb-4 max-w-full rounded" />
      )}
      <div className="flex flex-col space-y-4 max-w-sm">
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <button
          onClick={handleBooking}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          رزرو سایت اقامتی
        </button>
      </div>
    </div>
  );
}
