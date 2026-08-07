import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext.jsx';
import { ToastProvider } from './presentation/context/ToastContext.jsx';
import { AppRouter } from './presentation/routes/AppRouter.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}