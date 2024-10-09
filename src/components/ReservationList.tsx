import React from 'react';
import { useRooms } from '../hooks/useRooms';
import { useGuests } from '../hooks/useGuests';
import { Reservation } from '../hooks/useReservations';
import { useSettings } from '../contexts/SettingsContext';

interface ReservationListProps {
  reservations: Reservation[] | undefined;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
  const { data: rooms } = useRooms();
  const { data: guests } = useGuests();
  const { settings } = useSettings();

  if (!reservations || reservations.length === 0) {
    return <div className="text-center mt-8">No reservations found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Guest</th>
            <th className="py-3 px-4 text-left">Room</th>
            <th className="py-3 px-4 text-left">Check-in</th>
            <th className="py-3 px-4 text-left">Check-out</th>
            <th className="py-3 px-4 text-left">Total Amount</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Guests</th>
            <th className="py-3 px-4 text-left">Children</th>
            <th className="py-3 px-4 text-left">Early Check-in</th>
            <th className="py-3 px-4 text-left">Late Check-out</th>
            <th className="py-3 px-4 text-left">Extra Bed</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reservations.map((reservation) => {
            const room = rooms?.find(r => r.id === reservation.roomId);
            const guest = guests?.find(g => g.id === reservation.guestId);
            return (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{reservation.id}</td>
                <td className="py-2 px-4">{guest ? guest.name : 'Unknown'}</td>
                <td className="py-2 px-4">{room ? `${room.number} - ${room.type}` : 'Unknown'}</td>
                <td className="py-2 px-4">{reservation.checkIn}</td>
                <td className="py-2 px-4">{reservation.checkOut}</td>
                <td className="py-2 px-4">{settings?.currency} {reservation.totalAmount ? reservation.totalAmount.toFixed(2) : 'N/A'}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="py-2 px-4">{reservation.guestsCount}</td>
                <td className="py-2 px-4">{reservation.childrenCount}</td>
                <td className="py-2 px-4">{reservation.earlyCheckIn ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4">{reservation.lateCheckOut ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4">{reservation.extraBed ? 'Yes' : 'No'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;