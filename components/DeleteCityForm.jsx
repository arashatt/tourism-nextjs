'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';

export default function DeleteCitiesForm() {
  const [cities, setCities] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(data));
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    const res = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCities((prev) => prev.filter(city => city.id !== id));
    } else {
      alert('خطا در حذف');
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      {cities.map((city) => (
        <div key={city.id} className="flex items-center justify-between p-4 border rounded-xl">
          <span>{city.name}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">حذف</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  حذف شهر "{city.name}"؟
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>لغو</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleting === city.id}
                  onClick={() => handleDelete(city.id)}
                >
                  {deleting === city.id ? 'در حال حذف...' : 'تأیید'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
