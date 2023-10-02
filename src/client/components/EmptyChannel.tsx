import React from 'react';
import { css, styled } from 'styled-components';
import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import type { Channel } from 'src/client/consts/Channel';
import { EVERYONE_ORG_ID } from 'src/client/consts/consts';

interface EmptyChannelProps {
  channel: Channel;
}

export function EmptyChannel({ channel }: EmptyChannelProps) {
  const icon = (type: 'title' | 'text') =>
    channel.org === EVERYONE_ORG_ID ? (
      <ChannelIcon $type={type} />
    ) : (
      <PrivateChannelIcon $type={type} />
    );
  return (
    <Root>
      <ChannelName>
        {' '}
        {icon('title')}
        {channel.id}
      </ChannelName>
      <TextContainer>
        <span>This is the very beginning of the </span>
        <Emphasis>
          {icon('text')}
          {channel.id}
        </Emphasis>{' '}
        <span> channel.</span>
      </TextContainer>
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

const TextContainer = styled.div({
  display: 'flex',
  whiteSpace: 'pre-wrap',
});
