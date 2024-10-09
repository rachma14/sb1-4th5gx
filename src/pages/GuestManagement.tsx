import React from 'react'
import { useGuests } from '../hooks/useGuests'
import GuestList from '../components/GuestList'
import { useReservations } from '../hooks/useReservations'

const GuestManagement: React.FC = () => {
  const { data: guests, isLoading: isLoadingGuests, error: guestError } = useGuests();
  const { data: reservations, isLoading: isLoadingReservations, error: reservationError } = useReservations();

  if (isLoadingGuests || isLoadingReservations) return <div className="text-center mt-8">Loading guest data...</div>;
  if (guestError || reservationError) return <div className="text-center mt-8 text-red-500">Error: {(guestError || reservationError)?.message}</div>;
  if (!guests || guests.length === 0) return <div className="text-center mt-8">No guests found.</div>;

  const guestsWithReservations = guests.map(guest => ({
    ...guest,
    reservations: reservations?.filter(reservation => reservation.guestId === guest.id) || []
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Guest Management</h2>
      <GuestList guests={guestsWithReservations} />
    </div>
  )
}

export default GuestManagement