import React, { useState } from 'react';
import { useCreateReservation } from '../hooks/useReservations';
import { useRooms } from '../hooks/useRooms';

const QuickReservation: React.FC = () => {
  const [guestName, setGuestName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const createReservationMutation = useCreateReservation();
  const { data: rooms } = useRooms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReservationMutation.mutate({
      guestName,
      roomId,
      checkIn,
      checkOut,
      guestId: '', // This should be generated or retrieved from a guest selection
      totalAmount: 0, // This should be calculated based on room rate and stay duration
      status: 'confirmed',
      guestsCount: 1,
      childrenCount: 0,
      earlyCheckIn: false,
      lateCheckOut: false,
      extraBed: false,
      downPaymentAmount: 0,
      downPaymentMethod: '',
      roomType: rooms?.find(room => room.id === roomId)?.type || '',
    }, {
      onSuccess: () => {
        alert('Reservation added successfully!');
        // Reset form
        setGuestName('');
        setRoomId('');
        setCheckIn('');
        setCheckOut('');
      },
      onError: (error: unknown) => {
        alert(`Error adding reservation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  return (
    <div className="quick-reservation">
      <h2 className="text-xl font-bold mb-4">Quick Reservation</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields here */}
        <button type="submit">Create Reservation</button>
      </form>
    </div>
  );
};

export default QuickReservation;