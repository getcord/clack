import * as React from 'react';
import { Colors } from 'src/client/Colors';
import { styled } from 'styled-components';
const channelsOptions = ['general', 'what-the-quack', 'e', 'random'];

export function Channels({
  setCurrentChannel,
}: {
  setCurrentChannel: (channel: string) => void;
}) {
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
