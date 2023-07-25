import * as React from 'react';
import { Colors } from 'src/client/Colors';
import { useAPIFetch } from 'src/hooks/useAPIFetch';
import { styled } from 'styled-components';

export function Channels({
  setCurrentChannel,
}: {
  setCurrentChannel: (channel: string) => void;
}) {
  const channelsOptions = useAPIFetch<string[]>('/channels') ?? [];
  return (
    <ChannelsList>
      {channelsOptions.map((option, index) => (
        <ChannelButton key={index} onClick={() => setCurrentChannel(option)}>
          <div>#</div> <div> {option}</div>
        </ChannelButton>
      ))}
    </ChannelsList>
  );
}

const ChannelsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const ChannelButton = styled.button({
  background: Colors.purple,
  color: Colors.text,
  display: 'flex',
  gap: '8px',
  padding: '12px',
});
