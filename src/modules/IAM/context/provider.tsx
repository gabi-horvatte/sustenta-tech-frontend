import { useCallback, useEffect, useState } from 'react';
import { IAMContext } from './context';
import { useFetch } from '../../../hooks/useFetch';
import { useLocation, useNavigate } from 'react-router';
import { decodeJwt } from '@/lib/decode-jwt';

export const IAMProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const { data, error, fetch, loading } = useFetch<{ access_token: string; }>('/login');
  const login = useCallback((email: string, password: string) => {
    fetch({
      name: 'POST',
      body: {
        email,
        password,
      },
    });
  }, [fetch]);

  const logout = useCallback(() => {
    setAuthToken(undefined);
    localStorage.removeItem('authToken');
    navigate('/login');
  }, [navigate]);

  const handleLoginSuccess = useCallback((token: string) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    const decodedToken = decodeJwt(token);
    if (decodedToken) {
      if(decodedToken.payload.exp < Date.now() / 1000) {
        logout();
        return;
      }

      if(location.pathname !== '/login') return;

      if (decodedToken.payload.role === 'TEACHER') {
        navigate('/management/home');
      } else {
        navigate('/student/home');
      }
    }
  }, [navigate, logout, location.pathname]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) 
      handleLoginSuccess(authToken);
    else
      navigate('/login');
  }, [handleLoginSuccess, navigate]); 

  useEffect(() => {
    if (data) {
      handleLoginSuccess(data.access_token);
    }
  }, [data, handleLoginSuccess]);

  return (
    <IAMContext.Provider 
      value={{ 
        authToken, 
        login, 
        isLoginLoading: loading, 
        hasLoginError: !!error, 
        logout 
      }}>
      {children}
    </IAMContext.Provider>
  );
};