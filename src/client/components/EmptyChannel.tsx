import React from 'react';
import { css, styled } from 'styled-components';
import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import type { Channel } from 'src/client/context/ChannelsProvider';

interface EmptyChannelProps {
  channel: Channel;
}

export function EmptyChannel({ channel }: EmptyChannelProps) {
  const icon = (type: 'title' | 'text') =>
    channel.org ? (
      <PrivateChannelIcon $type={type} />
    ) : (
      <ChannelIcon $type={type} />
    );
  return (
    <Root>
      <ChannelName>
        {' '}
        {icon('title')}
        {channel.id}
      </ChannelName>
      <div>
        This is the very beginning of the{' '}
        <Emphasis>
          {icon('text')}
          {channel.id}
        </Emphasis>{' '}
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
  display: 'flex',
  alignItems: 'center',
});

const ChannelIcon = styled(HashtagIcon)<{ $type: 'title' | 'text' }>`
  ${({ $type }) =>
    $type === 'title'
      ? css`
          margin-right: 4px;
          width: 32px;
          height: 32px;
        `
      : css`
          margin-right: 2px;
          width: 15px;
          height: 15px;
        `}
`;

const PrivateChannelIcon = styled(LockClosedIcon)<{ $type: 'title' | 'text' }>`
  ${({ $type }) =>
    $type === 'title'
      ? css`
          margin-right: 4px;
          width: 32px;
          height: 32px;
        `
      : css`
          margin-right: 2px;
          width: 15px;
          height: 15px;
        `}
`;

const Emphasis = styled.strong({
  display: 'inline-flex',
  alignItems: 'center',
});
