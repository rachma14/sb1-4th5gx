import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const API_URL = '/api'

export interface Stay {
  checkIn: string;
  checkOut: string;
  nights: number;
  totalSpent: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  stays: Stay[];
}

const fetchGuests = async (): Promise<Guest[]> => {
  try {
    const response = await axios.get(`${API_URL}/guests`)
    return response.data.guests
  } catch (error) {
    console.error('Error fetching guests:', error)
    throw new Error('Failed to fetch guests: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

const addGuest = async (guest: Omit<Guest, 'id' | 'stays'>): Promise<Guest> => {
  try {
    const response = await axios.post(`${API_URL}/guests`, guest)
    return response.data.guest
  } catch (error) {
    console.error('Error adding guest:', error)
    throw new Error('Failed to add guest: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

export const useGuests = () => {
  return useQuery<Guest[], Error>('guests', fetchGuests)
}

export const useAddGuest = () => {
  const queryClient = useQueryClient()
  return useMutation(addGuest, {
    onSuccess: () => {
      queryClient.invalidateQueries('guests')
    },
    onError: (error: Error) => {
      console.error('Error in useAddGuest hook:', error)
    }
  })
}