import React from 'react';
import { styled } from 'styled-components';
import type { Channel } from 'src/client/consts/Channel';

interface EmptyChannelProps {
  channel: Channel;
}

export function EmptyChannel({ channel }: EmptyChannelProps) {
  return (
    <Root>
      <ChannelName>#{channel.id}</ChannelName>
      <div>
        This is the very beginning of the <strong>#{channel.id}</strong>{' '}
        channel.
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
