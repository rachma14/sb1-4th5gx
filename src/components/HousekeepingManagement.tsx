import React, { useState } from 'react';
import { useRooms, useUpdateRoom, Room } from '../hooks/useRooms';

const HousekeepingManagement: React.FC = () => {
  const { data: rooms, isLoading, error } = useRooms();
  const updateRoomMutation = useUpdateRoom();
  const [filter, setFilter] = useState<'all' | 'clean' | 'dirty'>('all');

  if (isLoading) return <div>Loading housekeeping data...</div>;
  if (error) return <div>Error loading housekeeping data</div>;
  if (!rooms || rooms.length === 0) return <div>No room data available.</div>;

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  const handleStatusChange = (room: Room, newStatus: 'clean' | 'dirty') => {
    updateRoomMutation.mutate(
      { ...room, status: newStatus },
      {
        onSuccess: () => {
          // You might want to refetch rooms or update the local state here
        },
        onError: (error) => {
          console.error('Failed to update room status:', error);
          alert('Failed to update room status. Please try again.');
        }
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Housekeeping Management</h3>
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'clean' | 'dirty')}
          className="p-2 border rounded"
        >
          <option value="all">All Rooms</option>
          <option value="clean">Clean Rooms</option>
          <option value="dirty">Dirty Rooms</option>
        </select>
      </div>
      <div className="space-y-2">
        {filteredRooms.map(room => (
          <div key={room.id} className="p-2 border rounded flex justify-between items-center">
            <span>Room {room.number} - {room.status}</span>
            <button
              onClick={() => handleStatusChange(room, room.status === 'clean' ? 'dirty' : 'clean')}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mark as {room.status === 'clean' ? 'Dirty' : 'Clean'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousekeepingManagement;