import { useContext } from 'react';
import { EventContext } from '../contexts/EventContext';

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
