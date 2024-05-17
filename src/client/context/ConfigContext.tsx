import React, { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';

type ConfigContextType = {
  giphy_api_key: string | undefined;
};

export const ConfigContext = createContext<ConfigContextType>({
  giphy_api_key: undefined,
});

export const ConfigContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const configData = useAPIFetch<{
    giphy_api_key: string | undefined;
  }>('/config');

  const contextValue = useMemo(() => {
    return (
      configData ?? {
        giphy_api_key: undefined,
      }
    );
  }, [configData]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};
