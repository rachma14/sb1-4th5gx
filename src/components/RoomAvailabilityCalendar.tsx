import React, { useState, useEffect } from 'react';
import { useRooms } from '../hooks/useRooms';
import { useReservations } from '../hooks/useReservations';

const RoomAvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: rooms, isLoading: isLoadingRooms } = useRooms();
  const { data: reservations, isLoading: isLoadingReservations } = useReservations();
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (rooms && reservations) {
      const newAvailabilityMap: Record<string, Record<string, boolean>> = {};
      
      rooms.forEach(room => {
        newAvailabilityMap[room.id] = {};
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          newAvailabilityMap[room.id][date.toISOString().split('T')[0]] = true;
        }
      });

      reservations.forEach(reservation => {
        const checkIn = new Date(reservation.checkIn);
        const checkOut = new Date(reservation.checkOut);
        
        for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
          if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
            newAvailabilityMap[reservation.roomId][d.toISOString().split('T')[0]] = false;
          }
        }
      });

      setAvailabilityMap(newAvailabilityMap);
    }
  }, [rooms, reservations, currentDate]);

  const getDaysArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  if (isLoadingRooms || isLoadingReservations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-blue-500 text-white rounded">Previous Month</button>
        <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-blue-500 text-white rounded">Next Month</button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Room</th>
            {getDaysArray().map(day => (
              <th key={day} className="py-2 px-4 border">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms?.map(room => (
            <tr key={room.id}>
              <td className="py-2 px-4 border font-semibold">{room.number}</td>
              {getDaysArray().map(day => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                const isAvailable = availabilityMap[room.id]?.[date];
                return (
                  <td key={`${room.id}-${day}`} className={`py-2 px-4 border text-center ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isAvailable ? '✓' : '✗'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomAvailabilityCalendar;