import React from 'react';
import { styled } from 'styled-components';

interface EmptyChannelProps {
  channelID: string;
}

export function EmptyChannel({ channelID }: EmptyChannelProps) {
  return (
    <Root>
      <ChannelName>#{channelID}</ChannelName>
      <div>
        This is the very beginning of the <strong>#{channelID}</strong> channel.
      </div>
    </Root>
  );
}

const Root = styled.div({
  padding: '8px 20px',
});

const ChannelName = styled.h1({
  fontWeight: 700,
});
