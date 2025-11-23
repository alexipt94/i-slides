import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/AppContext';
import { NavigationState } from '../../types/routing';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    const redirectState: NavigationState = {
      from: location.pathname,
      message: 'Для доступа к этой странице необходимо войти в систему'
    };
    
    return <Navigate to="/" state={redirectState} replace />;
  }

  return <>{children}</>;
};