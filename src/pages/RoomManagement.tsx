import React, { useState } from 'react'
import { useRooms, useAddRoom, useUpdateRoom, useDeleteRoom, Room } from '../hooks/useRooms'
import { useSettings } from '../contexts/SettingsContext'
import RoomList from '../components/RoomList'
import RoomForm from '../components/RoomForm'

const RoomManagement: React.FC = () => {
  const { data: rooms, isLoading, error } = useRooms()
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const addRoomMutation = useAddRoom()
  const updateRoomMutation = useUpdateRoom()
  const deleteRoomMutation = useDeleteRoom()
  const { settings } = useSettings()

  const handleSubmit = (roomData: Omit<Room, 'id'>) => {
    if (selectedRoom) {
      updateRoomMutation.mutate({ ...roomData, id: selectedRoom.id }, {
        onSuccess: () => {
          setSelectedRoom(null)
          alert('Room updated successfully')
        },
        onError: (error: unknown) => {
          alert(`Failed to update room: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      })
    } else {
      addRoomMutation.mutate(roomData, {
        onSuccess: () => {
          alert('Room added successfully')
        },
        onError: (error: unknown) => {
          alert(`Failed to add room: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      })
    }
  }

  const handleDelete = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoomMutation.mutate(roomId, {
        onSuccess: () => {
          alert('Room deleted successfully')
        },
        onError: (error: unknown) => {
          alert(`Failed to delete room: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      })
    }
  }

  if (isLoading) return <div>Loading rooms...</div>
  if (error) return <div>Error loading rooms: {error instanceof Error ? error.message : 'Unknown error'}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Room Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Room List</h3>
          <RoomList 
            rooms={rooms || []} 
            onEdit={setSelectedRoom} 
            onDelete={handleDelete}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{selectedRoom ? 'Edit Room' : 'Add New Room'}</h3>
          <RoomForm 
            room={selectedRoom} 
            onSubmit={handleSubmit}
            roomTypes={settings?.roomTypes || []}
          />
        </div>
      </div>
    </div>
  )
}

export default RoomManagement