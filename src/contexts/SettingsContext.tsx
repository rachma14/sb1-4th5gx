import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface RoomTypeSetting {
  name: string;
  weekdayRate: number;
  weekendRate: number;
}

export interface Settings {
  hotelName: string;
  address: string;
  phoneNumber: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;
  currency: string;
  taxRate: number;
  defaultRoomRate: number;
  maxOccupancyPerRoom: number;
  allowEarlyCheckIn: boolean;
  allowLateCheckOut: boolean;
  earlyCheckInFee: number;
  lateCheckOutFee: number;
  extraBedFee: number;
  roomTypes: RoomTypeSetting[];
}

interface SettingsContextType {
  settings: Settings | null;
  updateSettings: (newSettings: Settings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      await axios.put('/api/settings', newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};