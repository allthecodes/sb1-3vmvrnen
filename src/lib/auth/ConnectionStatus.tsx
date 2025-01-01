import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '../supabase';

export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);
    };

    checkConnection();
    
    // Periodically check connection
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return isConnected;
}

export function ConnectionError() {
  return (
    <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 px-4 py-2 rounded-md shadow-lg">
      Connection error. Please check your internet connection.
    </div>
  );
}