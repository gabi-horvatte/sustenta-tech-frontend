import React from 'react'

type IAMContextType = {
    authToken?: string;
    login: (email: string, password: string) => void;
    isLoginLoading: boolean;
    hasLoginError: boolean;
    logout: () => void;
}

export const IAMContext = React.createContext<IAMContextType>({
  authToken: undefined,
  login: () => {},
  isLoginLoading: false,
  hasLoginError: false,
  logout: () => {},
});

