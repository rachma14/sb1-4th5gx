import React from 'react';
import { useReservations, Reservation } from '../hooks/useReservations';

const BookingSourceTracker: React.FC = () => {
  const { data: reservations } = useReservations();

  // Implement booking source tracking logic
  const bookingSources = reservations?.reduce((acc, reservation: Reservation) => {
    const source = (reservation as any).bookingSource || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="booking-source-tracker">
      <h2 className="text-xl font-bold mb-4">Booking Source Tracker</h2>
      <ul>
        {Object.entries(bookingSources || {}).map(([source, count]) => (
          <li key={source}>
            {source}: {count} bookings
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingSourceTracker;