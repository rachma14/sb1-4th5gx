import React, { useState, useEffect } from 'react';
import { useSettings, Settings, RoomTypeSetting } from '../contexts/SettingsContext';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState<Settings>({
    hotelName: '',
    address: '',
    phoneNumber: '',
    email: '',
    checkInTime: '',
    checkOutTime: '',
    currency: '',
    taxRate: 0,
    defaultRoomRate: 0,
    maxOccupancyPerRoom: 1,
    allowEarlyCheckIn: false,
    allowLateCheckOut: false,
    earlyCheckInFee: 0,
    lateCheckOutFee: 0,
    extraBedFee: 0,
    roomTypes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setIsLoading(false);
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : 
               value
    }));
  };

  const handleRoomTypeChange = (index: number, field: keyof RoomTypeSetting, value: string | number) => {
    const updatedRoomTypes = [...(formData.roomTypes || [])];
    updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [field]: typeof value === 'string' ? value : Number(value)
    };
    setFormData(prev => ({ ...prev, roomTypes: updatedRoomTypes }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...(prev.roomTypes || []), { name: '', weekdayRate: 0, weekendRate: 0 }]
    }));
  };

  const removeRoomType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: (prev.roomTypes || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateSettings(formData);
      setSuccessMessage('Settings updated successfully!');
    } catch (error) {
      setErrorMessage('Failed to update settings. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Hotel Settings</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Settings */}
        <div>
          <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700">Hotel Name</label>
          <input
            type="text"
            id="hotelName"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">Check-in Time</label>
          <input
            type="time"
            id="checkInTime"
            name="checkInTime"
            value={formData.checkInTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">Check-out Time</label>
          <input
            type="time"
            id="checkOutTime"
            name="checkOutTime"
            value={formData.checkOutTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
          <input
            type="text"
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
          <input
            type="number"
            id="taxRate"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="defaultRoomRate" className="block text-sm font-medium text-gray-700">Default Room Rate</label>
          <input
            type="number"
            id="defaultRoomRate"
            name="defaultRoomRate"
            value={formData.defaultRoomRate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="maxOccupancyPerRoom" className="block text-sm font-medium text-gray-700">Max Occupancy Per Room</label>
          <input
            type="number"
            id="maxOccupancyPerRoom"
            name="maxOccupancyPerRoom"
            value={formData.maxOccupancyPerRoom}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="1"
            required
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="allowEarlyCheckIn"
              checked={formData.allowEarlyCheckIn}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2">Allow Early Check-in</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="allowLateCheckOut"
              checked={formData.allowLateCheckOut}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2">Allow Late Check-out</span>
          </label>
        </div>

        <div>
          <label htmlFor="earlyCheckInFee" className="block text-sm font-medium text-gray-700">Early Check-in Fee</label>
          <input
            type="number"
            id="earlyCheckInFee"
            name="earlyCheckInFee"
            value={formData.earlyCheckInFee}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="lateCheckOutFee" className="block text-sm font-medium text-gray-700">Late Check-out Fee</label>
          <input
            type="number"
            id="lateCheckOutFee"
            name="lateCheckOutFee"
            value={formData.lateCheckOutFee}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="extraBedFee" className="block text-sm font-medium text-gray-700">Extra Bed Fee</label>
          <input
            type="number"
            id="extraBedFee"
            name="extraBedFee"
            value={formData.extraBedFee}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Room Types */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Room Types</h2>
          {formData.roomTypes && formData.roomTypes.map((roomType, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700">Room Type Name</label>
                <input
                  type="text"
                  value={roomType.name}
                  onChange={(e) => handleRoomTypeChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Weekday Rate</label>
                <input
                  type="number"
                  value={roomType.weekdayRate}
                  onChange={(e) => handleRoomTypeChange(index, 'weekdayRate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Weekend Rate</label>
                <input
                  type="number"
                  value={roomType.weekendRate}
                  onChange={(e) => handleRoomTypeChange(index, 'weekendRate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeRoomType(index)}
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoomType}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Room Type
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;