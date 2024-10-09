import React from 'react';
import { useGuests } from '../hooks/useGuests';
import { useReservations } from '../hooks/useReservations';

const LoyaltyProgram: React.FC = () => {
  const { data: guests, isLoading: isLoadingGuests, error: guestError } = useGuests();
  const { data: reservations, isLoading: isLoadingReservations, error: reservationError } = useReservations();

  const calculateLoyaltyPoints = (guestId: string) => {
    if (!reservations) return 0;
    const guestReservations = reservations.filter(res => res.guestId === guestId);
    return guestReservations.length * 100; // 100 points per stay
  };

  if (isLoadingGuests || isLoadingReservations) return <div>Loading loyalty program data...</div>;
  if (guestError || reservationError) return <div>Error loading loyalty program data</div>;
  if (!guests || guests.length === 0) return <div>No guest data available.</div>;

  const guestsWithPoints = guests.map(guest => ({
    ...guest,
    loyaltyPoints: calculateLoyaltyPoints(guest.id)
  })).sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Top Loyal Guests</h3>
      <div className="space-y-2">
        {guestsWithPoints.slice(0, 5).map(guest => (
          <div key={guest.id} className="p-2 border rounded">
            <p><strong>{guest.name}</strong></p>
            <p>Loyalty Points: {guest.loyaltyPoints}</p>
            <p>Total Stays: {reservations?.filter(res => res.guestId === guest.id).length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyProgram;