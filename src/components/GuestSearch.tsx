import React, { useState } from 'react';
import { useGuests } from '../hooks/useGuests';

const GuestSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: guests, isLoading, error } = useGuests();

  if (isLoading) return <div>Loading guests...</div>;
  if (error) return <div>Error loading guests: {error.message}</div>;

  const filteredGuests = guests?.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Guest Search</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search guests..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="space-y-2">
        {filteredGuests.length > 0 ? (
          filteredGuests.map(guest => (
            <div key={guest.id} className="p-2 border rounded">
              <p><strong>{guest.name}</strong></p>
              <p>{guest.email}</p>
              <p>Total Stays: {guest.stays?.length || 0}</p>
            </div>
          ))
        ) : (
          <p>No guests found.</p>
        )}
      </div>
    </div>
  );
};

export default GuestSearch;