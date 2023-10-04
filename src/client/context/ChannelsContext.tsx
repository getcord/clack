import { createContext } from 'react';
export type Channel = {
  id: string;
  org: string;
};

type ChannelsContextType = {
  channels: Channel[];
  refetch: () => void;
};

export const ChannelsContext = createContext<ChannelsContextType>({
  channels: [],
  refetch: () => {},
});
