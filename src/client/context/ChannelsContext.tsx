import { createContext } from 'react';
import type { Channel } from 'src/client/consts/Channel';

type ChannelsContextType = {
  channels: Channel[];
  refetch: () => void;
};

export const ChannelsContext = createContext<ChannelsContextType>({
  channels: [],
  refetch: () => {},
});
