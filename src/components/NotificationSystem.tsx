import React, { useEffect, useState } from 'react';
import { useReservations } from '../hooks/useReservations';

interface Notification {
  id: string;
  message: string;
  type: 'check-in' | 'check-out' | 'payment';
}

const NotificationSystem: React.FC = () => {
  const { data: reservations } = useReservations();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (reservations) {
      const today = new Date();
      const newNotifications: Notification[] = [];

      reservations.forEach(reservation => {
        const checkInDate = new Date(reservation.checkIn);
        const checkOutDate = new Date(reservation.checkOut);

        if (checkInDate.toDateString() === today.toDateString()) {
          newNotifications.push({
            id: `checkin-${reservation.id}`,
            message: `Check-in today: ${reservation.guestName}`,
            type: 'check-in'
          });
        }

        if (checkOutDate.toDateString() === today.toDateString()) {
          newNotifications.push({
            id: `checkout-${reservation.id}`,
            message: `Check-out today: ${reservation.guestName}`,
            type: 'check-out'
          });
        }

        if (reservation.totalAmount > reservation.downPaymentAmount) {
          newNotifications.push({
            id: `payment-${reservation.id}`,
            message: `Payment due: ${reservation.guestName}`,
            type: 'payment'
          });
        }
      });

      setNotifications(newNotifications);
    }
  }, [reservations]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      <div className="space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-2 rounded ${
              notification.type === 'check-in' ? 'bg-green-100' :
              notification.type === 'check-out' ? 'bg-blue-100' :
              'bg-yellow-100'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;