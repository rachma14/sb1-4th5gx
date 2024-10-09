import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_URL = '/api';

export interface Room {
  id: string;
  number: string;
  type: string;
  status: string;
  rate: number;
  capacity: number;
}

const fetchRooms = async (): Promise<Room[]> => {
  const response = await axios.get(`${API_URL}/rooms`);
  return response.data.rooms;
};

export const useRooms = () => {
  return useQuery<Room[], Error>('rooms', fetchRooms);
};

const addRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  const response = await axios.post(`${API_URL}/rooms`, room);
  return response.data;
};

export const useAddRoom = () => {
  const queryClient = useQueryClient();
  return useMutation(addRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
    },
  });
};

const updateRoom = async (room: Room): Promise<Room> => {
  const response = await axios.put(`${API_URL}/rooms/${room.id}`, room);
  return response.data;
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation(updateRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
    },
  });
};

const deleteRoom = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/rooms/${id}`);
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms');
    },
  });
};