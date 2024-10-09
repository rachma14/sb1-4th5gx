import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_URL = '/api';

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: string;
  guestsCount: number;
  childrenCount: number;
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  extraBed: boolean;
  downPaymentAmount: number;
  downPaymentMethod: string;
  guestName: string;
  roomType: string;
  roomNumber?: string;
}

const fetchReservations = async (): Promise<Reservation[]> => {
  const response = await axios.get(`${API_URL}/reservations`);
  return response.data.reservations;
};

export const useReservations = () => {
  return useQuery<Reservation[], Error>('reservations', fetchReservations);
};

const createReservation = async (reservationData: Omit<Reservation, 'id'>): Promise<Reservation> => {
  const response = await axios.post(`${API_URL}/reservations`, reservationData);
  return response.data;
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation(createReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
    },
  });
};

const updateReservationStatus = async ({ id, status }: { id: string; status: string }): Promise<Reservation> => {
  const response = await axios.patch(`${API_URL}/reservations/${id}`, { status });
  return response.data;
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(updateReservationStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
    },
  });
};