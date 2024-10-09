import React from 'react'
import { useReservations } from '../hooks/useReservations'
import ReservationList from '../components/ReservationList'
import ReservationForm from '../components/ReservationForm'
import ErrorBoundary from '../components/ErrorBoundary'

const Reservations: React.FC = () => {
  const { data: reservations, isLoading, error } = useReservations()

  if (isLoading) return <div className="text-center mt-8">Loading reservations...</div>
  if (error) {
    console.error('Error in Reservations component:', error);
    return (
      <div className="text-center mt-8 text-red-500">
        <p>Error loading reservations: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Reservations</h2>
      <div className="grid grid-cols-1 gap-8">
        <ErrorBoundary>
          <div>
            <h3 className="text-xl font-semibold mb-4">New Reservation</h3>
            <ReservationForm />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <div>
            <h3 className="text-xl font-semibold mb-4">Reservation List</h3>
            <div className="overflow-x-auto">
              <ReservationList reservations={reservations} />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default Reservations