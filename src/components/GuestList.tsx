import React from 'react';

interface Stay {
  checkIn: string;
  checkOut: string;
  nights: number;
  totalSpent: number;
}

interface Reservation {
  id: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  stays?: Stay[];
  reservations?: Reservation[];
}

interface GuestListProps {
  guests: Guest[] | undefined;
}

const GuestList: React.FC<GuestListProps> = ({ guests }) => {
  if (!guests || guests.length === 0) {
    return <div>No guests found.</div>;
  }

  return (
    <div className="space-y-4">
      {guests.map((guest) => {
        const totalStays = (guest.stays?.length || 0) + (guest.reservations?.length || 0);
        const totalNights = (guest.stays?.reduce((sum, stay) => sum + (stay.nights || 0), 0) || 0) +
          (guest.reservations?.reduce((sum, res) => {
            const checkIn = new Date(res.checkIn);
            const checkOut = new Date(res.checkOut);
            return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) || 0);
        const totalSpent = (guest.stays?.reduce((sum, stay) => sum + (stay.totalSpent || 0), 0) || 0) +
          (guest.reservations?.reduce((sum, res) => sum + (res.totalAmount || 0), 0) || 0);

        return (
          <div key={guest.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{guest.name}</h3>
            <p>Email: {guest.email}</p>
            <p>Phone: {guest.phone}</p>
            <p>Total Visits: {totalStays}</p>
            <p>Total Nights: {totalNights}</p>
            <p>Total Spent: ${totalSpent.toFixed(2)}</p>
            <h4 className="font-semibold mt-2">Stay History:</h4>
            <ul className="list-disc list-inside">
              {guest.stays?.map((stay, index) => (
                <li key={`stay-${index}`}>
                  {stay.checkIn} to {stay.checkOut} ({stay.nights || 0} nights, ${(stay.totalSpent || 0).toFixed(2)})
                </li>
              ))}
              {guest.reservations?.map((reservation) => (
                <li key={`reservation-${reservation.id}`}>
                  {reservation.checkIn} to {reservation.checkOut} (Upcoming, ${(reservation.totalAmount || 0).toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default GuestList;