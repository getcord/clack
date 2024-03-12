import React, { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
export type CordVersion = '3.0' | '4.0';

type CordVersionType = {
  version: CordVersion;
  setVersion: (version: CordVersion) => void;
  toggleVersion: () => void;
};

export const CordVersionContext = createContext<CordVersionType>({
  version: '3.0',
  setVersion: () => {},
  toggleVersion: () => {},
});

export const CordVersionProvider = ({ children }: { children: ReactNode }) => {
  const [version, setVersion] = useState<CordVersion>('4.0');

  const toggleVersion = useCallback(() => {
    if (version === '3.0') {
      setVersion('4.0');
    } else {
      setVersion('3.0');
    }
  }, [version, setVersion]);

  const contextValue = { version, setVersion, toggleVersion };

  return (
    <CordVersionContext.Provider value={contextValue}>
      {children}
    </CordVersionContext.Provider>
  );
};
