import { useCallback, useEffect, useState } from 'react';
import { IAMContext } from './context';
import { useFetch } from '../../../hooks/useFetch';
import { useLocation, useNavigate } from 'react-router';
import { decodeJwt } from '@/lib/decode-jwt';

export const IAMProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [hasVerifiedToken, setHasVerifiedToken] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ 
    id: string; 
    email: string; 
    name: string; 
    last_name: string; 
    birth_date: string;
    phone: string;
  } & ({
    role: 'TEACHER';
    manager: boolean;
  } | {
    role: 'STUDENT';
    code: string;
    classroom_id: string;
  }) | null>(null);

  const { data, error, fetch, loading } = useFetch<{ access_token: string; }>('/login');
  const login = useCallback(async (email: string, password: string) => {
    await fetch({
      name: 'POST',
      body: {
        email,
        password,
      },
    });
  }, [fetch]);


  const logout = useCallback(() => {
    setAuthToken(undefined);
    setUser(null);
    setHasLoggedOut(true);
    localStorage.removeItem('authToken');
    navigate('/login');
  }, [navigate]);

  const handleLoginSuccess = useCallback((token: string) => {
    setHasLoggedOut(false);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    const decodedToken = decodeJwt(token);
    console.log({ decodedToken });
    if (decodedToken) {
      if(decodedToken.payload.exp < Date.now() / 1000) {
        logout();
        return;
      }

      setUser({
        id: decodedToken.payload.id,
        email: decodedToken.payload.email,
        name: decodedToken.payload.name,
        last_name: decodedToken.payload.last_name,
        birth_date: decodedToken.payload.birth_date,
        phone: decodedToken.payload.phone,
        ...(decodedToken.payload.role === 'TEACHER' ? {
          role: decodedToken.payload.role,
          manager: decodedToken.payload.manager,
        } : {
          role: decodedToken.payload.role,
          code: decodedToken.payload.code,
          classroom_id: decodedToken.payload.classroom_id,
        }),
      });

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
    if (authToken && !hasLoggedOut) 
      handleLoginSuccess(authToken);
    else
      navigate('/login');
  
    setHasVerifiedToken(true);
  }, []); 

  useEffect(() => {
    if (data) {
      handleLoginSuccess(data.access_token);
    }
  }, [data]);

  return (
    <IAMContext.Provider 
      value={{ 
        authToken, 
        hasVerifiedToken,
        login, 
        isLoginLoading: loading, 
        hasLoginError: !!error, 
        logout,
        user,
      }}>
      {children}
    </IAMContext.Provider>
  );
};