import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Reservation } from '../hooks/useReservations';

interface InvoiceProps {
  reservation: Reservation;
  invoiceNumber: string;
}

const Invoice: React.FC<InvoiceProps> = ({ reservation, invoiceNumber }) => {
  const { settings } = useSettings();

  if (!settings) {
    return <div>Loading settings...</div>;
  }

  const checkInDate = new Date(reservation.checkIn).toLocaleDateString();
  const checkOutDate = new Date(reservation.checkOut).toLocaleDateString();

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{settings.hotelName}</h1>
        <p>{settings.address}</p>
        <p>Phone: {settings.phoneNumber}</p>
      </div>
      
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold">PAID Invoice</h2>
          <p>#{invoiceNumber}</p>
        </div>
        <div>
          <p className="font-semibold">Balance Due</p>
          <p className="text-xl">{settings.currency}0.00</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-semibold">Bill To</h3>
        <p>{reservation.guestName}</p>
      </div>
      
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left">Item & Description</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Rate</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {reservation.roomType}<br />
              {checkInDate} - {checkOutDate}
            </td>
            <td className="text-right">1.00</td>
            <td className="text-right">{settings.currency}{reservation.totalAmount?.toFixed(2)}</td>
            <td className="text-right">{settings.currency}{reservation.totalAmount?.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <div>
        <h3 className="font-semibold">Notes</h3>
        <p>Thanks for your business.</p>
      </div>
    </div>
  );
};

export default Invoice;