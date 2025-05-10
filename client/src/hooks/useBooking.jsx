import { apiRequest } from '@/lib/api';
import { createContext, useContext, useEffect, useState } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);

  useEffect(() => {
    const savedBooking = localStorage.getItem("booking");
    if (savedBooking) {
      setBooking(JSON.parse(savedBooking));
    }
    setLoadingBooking(false);
  }, []);

  const saveBooking = (data) => {
    setBooking(data);
    localStorage.setItem('booking', JSON.stringify(data));
  }

  const removeBooking = () => {
    setBooking(null);
    localStorage.removeItem('booking');
  }

  return (
    <BookingContext.Provider value={{ booking, setBooking, loadingBooking, saveBooking, removeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  try {
    return useContext(BookingContext);
  } catch (err) {
    throw new Error('useBooking precisa estar envolto por BookingProvider');
  }
}
