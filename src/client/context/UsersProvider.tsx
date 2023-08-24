import React, { createContext } from 'react';
import type { ServerUserData } from '@cord-sdk/types';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';

type UsersContextType = {
  usersData: ServerUserData[];
};

export const UsersContext = createContext<UsersContextType>({ usersData: [] });

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function UsersProvider({ children }: React.PropsWithChildren) {
  const usersData = useAPIFetch<ServerUserData[]>('/usersData');

  return (
    <UsersContext.Provider value={{ usersData: usersData ?? [] }}>
      {children}
    </UsersContext.Provider>
  );
}
