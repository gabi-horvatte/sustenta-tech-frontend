import React from 'react'

type IAMContextType = {
    authToken?: string;
    hasVerifiedToken: boolean;
    login: (email: string, password: string) => Promise<void>;
    isLoginLoading: boolean;
    hasLoginError: boolean;
    logout: () => void;
}

export const IAMContext = React.createContext<IAMContextType>({
  authToken: undefined,
  hasVerifiedToken: false,
  login: async () => {},
  isLoginLoading: false,
  hasLoginError: false,
  logout: () => {},
});

