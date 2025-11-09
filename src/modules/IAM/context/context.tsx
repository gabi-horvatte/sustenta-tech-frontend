import React from 'react'

type IAMContextType = {
    authToken?: string;
    hasVerifiedToken: boolean;
    login: (email: string, password: string) => Promise<void>;
    isLoginLoading: boolean;
    hasLoginError: boolean;
    logout: () => void;
    user: {
      id: string;
      email: string;
      name: string;
      last_name: string;
      phone: string;
      birth_date: string;
    } & ({
      role: 'TEACHER';
      manager: boolean;
    } | {
      role: 'STUDENT';
      code: string;
      classroom_id: string;
    }) | null;
}

export const IAMContext = React.createContext<IAMContextType>({
  authToken: undefined,
  hasVerifiedToken: false,
  login: async () => {},
  isLoginLoading: false,
  hasLoginError: false,
  logout: () => {},
  user: null,
});

