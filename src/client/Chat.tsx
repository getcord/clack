import React from 'react';
import { Composer } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Colors } from './Colors';
import { Messages } from './Messages';

interface ChatProps {
  channel: string;
}

export function Chat({ channel }: ChatProps) {
  return (
    <Wrapper>
      <ChannelDetailsBar>
        <ChannelName># {channel}</ChannelName>
      </ChannelDetailsBar>
      <Toolbar> + Add a bookmark</Toolbar>
      <MessagesWrapper>
        <Messages channel={channel} />
      </MessagesWrapper>
      <ComposerWrapper>
        <Composer location={{ channel }} showExpanded />
      </ComposerWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div({
  display: 'grid',
  height: '100%',
  flexDirection: 'column',
  gridTemplateRows: 'auto auto 1fr auto',
  gridTemplateAreas: `
  "channel-details"
  "toolbar"
  "messages"
  "composer"`,
  padding: '0',
});

const ChannelDetailsBar = styled.div({
  gridArea: 'channel-details',
  padding: '0 16px 0 20px',
});

const ChannelName = styled.h1({
  fontSize: '18px',
  fontWeight: '900',
  lineHeight: '1.33',
});

const Toolbar = styled.div({
  borderBottom: `1px solid ${Colors.lightGray}`,
  borderTop: `1px solid ${Colors.lightGray}`,
  fontSize: '13px',
  color: Colors.darkGray,
  padding: '10px 20px',
});

const MessagesWrapper = styled.div({
  gridArea: 'messages',
});

const ComposerWrapper = styled.div({
  gridArea: 'composer',
  padding: '0 20px 20px',
});
