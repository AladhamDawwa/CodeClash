import React, { ReactNode, createContext, useContext, useState } from 'react';

interface NavigationContextProps {
  canAccessGameSession: boolean;
  canAccessMatchLoading: boolean;
  allowGameSessionAccess: () => void;
  allowMatchLoadingAccess: () => void;
}

const NavigationContext = createContext<NavigationContextProps | undefined>(
  undefined,
);

export const useNavigation = (): NavigationContextProps => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const [canAccessGameSession, setCanAccessGameSession] = useState(false);
  const [canAccessMatchLoading, setCanAccessMatchLoading] = useState(false);

  const allowGameSessionAccess = () => {
    setCanAccessGameSession(true);
  };

  const allowMatchLoadingAccess = () => {
    setCanAccessMatchLoading(true);
  };

  return (
    <NavigationContext.Provider
      value={{
        canAccessGameSession,
        canAccessMatchLoading,
        allowGameSessionAccess,
        allowMatchLoadingAccess,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
