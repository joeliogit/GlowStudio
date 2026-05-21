import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './assets/styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: '"DM Sans", sans-serif',
                borderRadius: '12px',
                background: '#fff',
                color: '#1A1A2E',
                boxShadow: '0 4px 24px rgba(233,30,140,0.12)',
                border: '1px solid #FFD6E8',
              },
              success: {
                iconTheme: { primary: '#E91E8C', secondary: '#FFF0F5' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#FFF' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
