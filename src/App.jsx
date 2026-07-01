import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

if (typeof window !== 'undefined') {
  window.__REACT_ROUTER_FUTURE_FLAGS__ = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

import AppRoutes from './routes';