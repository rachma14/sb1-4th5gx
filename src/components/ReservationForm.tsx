import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCreateReservation, Reservation } from '../hooks/useReservations';
import { useRooms } from '../hooks/useRooms';
import { useGuests } from '../hooks/useGuests';
import { useNavigate } from 'react-router-dom';

interface ReservationFormData extends Omit<Reservation, 'id' | 'status' | 'downPaymentAmount' | 'downPaymentMethod'> {}

const ReservationForm: React.FC = () => {
  const { handleSubmit } = useForm<ReservationFormData>();
  const createReservationMutation = useCreateReservation();
  const { data: rooms } = useRooms();
  const { data: guests } = useGuests();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<ReservationFormData> = async (data) => {
    try {
      await createReservationMutation.mutateAsync({
        ...data,
        status: 'confirmed',
        downPaymentAmount: 0,
        downPaymentMethod: '',
        guestName: guests?.find(g => g.id === data.guestId)?.name || '',
        roomType: rooms?.find(r => r.id === data.roomId)?.type || '',
      });
      setSuccessMessage('Reservation created successfully!');
      setErrorMessage(null);
      navigate('/reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
      setErrorMessage('Failed to create reservation. Please try again. ' + (error instanceof Error ? error.message : 'Unknown error'));
      setSuccessMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Add form fields here */}
      <button type="submit">Create Reservation</button>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
};

export default ReservationForm;