import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const API_URL = '/api'

export interface Invoice {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  roomCharge: number;
  additionalCharges: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'paid' | 'unpaid' | 'partially_paid';
}

const fetchInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get(`${API_URL}/invoices`);
    return response.data.invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices');
  }
};

const createInvoice = async (invoice: Omit<Invoice, 'id' | 'status'>): Promise<Invoice> => {
  try {
    const response = await axios.post(`${API_URL}/invoices`, invoice);
    return response.data.invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }
};

const updateInvoiceStatus = async ({ id, status }: { id: string; status: Invoice['status'] }): Promise<Invoice> => {
  try {
    const response = await axios.patch(`${API_URL}/invoices/${id}`, { status });
    return response.data.invoice;
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw new Error('Failed to update invoice status');
  }
};

export const useInvoices = () => {
  return useQuery<Invoice[], Error>('invoices', fetchInvoices);
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation(createInvoice, {
    onSuccess: () => {
      queryClient.invalidateQueries('invoices');
    },
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(updateInvoiceStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('invoices');
    },
  });
};