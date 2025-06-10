// app/tours/[tourId]/page.jsx
"use client";

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TourPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());

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
        tourId: params.tourId,
        date: startDate,
        userId: session.user.id,
      }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      // Handle error
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Tour details would be fetched and displayed here */}
      <h1 className="text-3xl font-bold my-6">Book Your Tour</h1>
      <div className="flex flex-col space-y-4">
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <button onClick={handleBooking} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </div>
  );
}
