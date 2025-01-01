import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ConnectionError, useConnectionStatus } from './lib/auth/ConnectionStatus';
import AppRoutes from './routes';

export default function App() {
  const isConnected = useConnectionStatus();

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {!isConnected && <ConnectionError />}
      </AuthProvider>
    </BrowserRouter>
  );
}