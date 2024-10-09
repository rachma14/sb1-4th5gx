import React from 'react';
import QuickReservation from '../components/QuickReservation';
import RoomAvailabilityCalendar from '../components/RoomAvailabilityCalendar';
import GuestSearch from '../components/GuestSearch';
import NotificationSystem from '../components/NotificationSystem';
import HousekeepingManagement from '../components/HousekeepingManagement';
import LoyaltyProgram from '../components/LoyaltyProgram';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <QuickReservation />
      <RoomAvailabilityCalendar />
      <GuestSearch />
      <NotificationSystem />
      <HousekeepingManagement />
      <LoyaltyProgram />
    </div>
  );
};

export default Dashboard;