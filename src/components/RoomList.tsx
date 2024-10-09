import React from 'react';
import { Room } from '../hooks/useRooms';

interface RoomListProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div key={room.id} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Room {room.number}</h3>
          <p>Type: {room.type}</p>
          <p>Status: {room.status}</p>
          <p>Rate: ${room.rate}/night</p>
          <div className="mt-2 space-x-2">
            <button 
              onClick={() => onEdit(room)} 
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(room.id)} 
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;