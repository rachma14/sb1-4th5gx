import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateInvoice } from '../hooks/useInvoices';

interface InvoiceFormData {
  reservationId: string;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  roomCharge: number;
  additionalCharges: number;
  totalAmount: number;
  paymentMethod: string;
}

const InvoiceForm: React.FC = () => {
  const { handleSubmit, watch, setValue } = useForm<InvoiceFormData>();
  const createInvoiceMutation = useCreateInvoice();

  const roomCharge = watch('roomCharge');
  const additionalCharges = watch('additionalCharges');

  useEffect(() => {
    const total = (Number(roomCharge) || 0) + (Number(additionalCharges) || 0);
    setValue('totalAmount', total);
  }, [roomCharge, additionalCharges, setValue]);

  const onSubmit = (data: InvoiceFormData) => {
    createInvoiceMutation.mutate(data, {
      onSuccess: () => {
        alert('Invoice created successfully!');
      },
      onError: (error: unknown) => {
        alert(`Error creating invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={createInvoiceMutation.isLoading}
      >
        {createInvoiceMutation.isLoading ? 'Creating...' : 'Generate Invoice'}
      </button>
    </form>
  );
};

export default InvoiceForm;