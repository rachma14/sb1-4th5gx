import React, { useState } from 'react'
import { useReservations, useUpdateReservationStatus, Reservation } from '../hooks/useReservations'
import { useCreateInvoice, useUpdateInvoiceStatus, Invoice } from '../hooks/useInvoices'
import { useSettings } from '../contexts/SettingsContext'
import InvoiceComponent from '../components/Invoice'

interface ReservationWithInvoice extends Reservation {
  invoiceId?: string;
}

const Billing: React.FC = () => {
  const { data: reservations, isLoading, error } = useReservations();
  const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceStatusMutation = useUpdateInvoiceStatus();
  const updateReservationStatusMutation = useUpdateReservationStatus();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithInvoice | null>(null);
  const { settings } = useSettings();

  const handleDownPaymentInvoice = (reservation: Reservation) => {
    if (!settings) {
      setErrorMessage('Settings not loaded. Please try again later.');
      return;
    }

    const invoiceData: Omit<Invoice, 'id' | 'status'> = {
      reservationId: reservation.id,
      guestName: reservation.guestName,
      roomNumber: reservation.roomNumber || 'N/A',
      checkInDate: reservation.checkIn,
      checkOutDate: reservation.checkOut,
      roomCharge: reservation.downPaymentAmount ?? 0,
      additionalCharges: 0,
      totalAmount: reservation.downPaymentAmount ?? 0,
      paymentMethod: 'cash'
    };

    createInvoiceMutation.mutate(invoiceData, {
      onSuccess: (invoice) => {
        setSuccessMessage('Downpayment invoice created successfully!');
        setErrorMessage(null);
        setSelectedReservation({ ...reservation, invoiceId: invoice.id });
      },
      onError: (error: unknown) => {
        setErrorMessage(`Error creating downpayment invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  const handleFullPayment = (reservation: Reservation) => {
    if (!settings) {
      setErrorMessage('Settings not loaded. Please try again later.');
      return;
    }

    const remainingAmount = (reservation.totalAmount ?? 0) - (reservation.downPaymentAmount ?? 0);
    const invoiceData: Omit<Invoice, 'id' | 'status'> = {
      reservationId: reservation.id,
      guestName: reservation.guestName,
      roomNumber: reservation.roomNumber || 'N/A',
      checkInDate: reservation.checkIn,
      checkOutDate: reservation.checkOut,
      roomCharge: remainingAmount,
      additionalCharges: 0,
      totalAmount: remainingAmount,
      paymentMethod: 'cash'
    };

    createInvoiceMutation.mutate(invoiceData, {
      onSuccess: (invoice) => {
        updateInvoiceStatusMutation.mutate(
          { id: invoice.id, status: 'paid' },
          {
            onSuccess: () => {
              updateReservationStatusMutation.mutate(
                { id: reservation.id, status: 'paid' },
                {
                  onSuccess: () => {
                    setSuccessMessage('Full payment processed, invoice created, and reservation status updated successfully!');
                    setErrorMessage(null);
                    setSelectedReservation({ ...reservation, invoiceId: invoice.id, status: 'paid' });
                  },
                  onError: (error: unknown) => {
                    setErrorMessage(`Error updating reservation status: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }
                }
              );
            },
            onError: (error: unknown) => {
              setErrorMessage(`Error updating invoice status: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        );
      },
      onError: (error: unknown) => {
        setErrorMessage(`Error creating full payment invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  const handlePrintInvoice = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setTimeout(() => {
      window.print();
      setSelectedReservation(null);
    }, 100);
  };

  if (isLoading) return <div className="text-center mt-8">Loading reservations...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  if (!reservations || reservations.length === 0) return <div className="text-center mt-8">No reservations found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Billing</h2>
      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{errorMessage}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
      <div className="space-y-4">
        {reservations.map((reservation: Reservation) => (
          <div key={reservation.id} className="border p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-2">Reservation ID: {reservation.id}</h3>
            <p><strong>Guest:</strong> {reservation.guestName}</p>
            <p><strong>Room Type:</strong> {reservation.roomType}</p>
            <p><strong>Check-in:</strong> {reservation.checkIn}</p>
            <p><strong>Check-out:</strong> {reservation.checkOut}</p>
            <p><strong>Total Amount:</strong> {settings?.currency} {reservation.totalAmount?.toFixed(2) ?? 'N/A'}</p>
            <p><strong>Down Payment:</strong> {settings?.currency} {reservation.downPaymentAmount?.toFixed(2) ?? 'N/A'}</p>
            <p><strong>Status:</strong> {reservation.status}</p>
            <div className="mt-4 space-x-2">
              {reservation.status !== 'paid' && (
                <>
                  <button
                    onClick={() => handleDownPaymentInvoice(reservation)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={createInvoiceMutation.isLoading}
                  >
                    Print Down Payment Invoice
                  </button>
                  <button
                    onClick={() => handleFullPayment(reservation)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={createInvoiceMutation.isLoading || updateInvoiceStatusMutation.isLoading || updateReservationStatusMutation.isLoading}
                  >
                    Process Full Payment
                  </button>
                </>
              )}
              {reservation.status === 'paid' && (
                <button
                  onClick={() => handlePrintInvoice(reservation)}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Print Full Payment Invoice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedReservation && (
        <div className="fixed inset-0 bg-white z-50 p-8">
          <InvoiceComponent reservation={selectedReservation} invoiceNumber={`INV-${String(selectedReservation.id).padStart(6, '0')}`} />
        </div>
      )}
    </div>
  )
}

export default Billing