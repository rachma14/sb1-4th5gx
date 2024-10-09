import React from 'react';
import { useForm } from 'react-hook-form';
import { Room } from '../hooks/useRooms';
import { RoomTypeSetting } from '../contexts/SettingsContext';

interface RoomFormProps {
  room?: Room | null;
  onSubmit: (data: Omit<Room, 'id'>) => void;
  roomTypes: RoomTypeSetting[];
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onSubmit, roomTypes }) => {
  const { handleSubmit } = useForm<Omit<Room, 'id'>>({
    defaultValues: room ? { ...room } : {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
      <div>
        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Type</label>
        <select
          id="roomType"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {roomTypes.map((type) => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        </select>
      </div>
      {/* Add other form fields here */}
    </form>
  );
};

export default RoomForm;