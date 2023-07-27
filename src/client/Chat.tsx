import React, { useState } from 'react';
import { styled, keyframes } from 'styled-components';
import { Colors } from './Colors';
import { Threads } from './Threads';
import { PageHeader } from './PageHeader';
import { StyledComposer } from './StyledCord';

interface ChatProps {
  channel: string;
  onOpenThread: (threadID: string) => void;
}

export function Chat({ channel, onOpenThread }: ChatProps) {
  const [showToolbar, setShowToolbar] = useState(true);
  return (
    <Wrapper>
      <ChannelDetailsBar>
        <PageHeader># {channel}</PageHeader>
        <Toolbar $showToolbar={showToolbar}> + Add a bookmark</Toolbar>
      </ChannelDetailsBar>
      <StyledThreads
        onScrollUp={() => {
          setShowToolbar(false);
        }}
        onScrollToBottom={() => setShowToolbar(true)}
        channel={channel}
        onOpenThread={onOpenThread}
      />
      <StyledComposer location={{ channel }} showExpanded />
    </Wrapper>
  );
}

const Wrapper = styled.div({
  display: 'grid',
  height: '100%',
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateAreas: `
  "channel-details"
  "threads"
  "composer"`,
  padding: '0',
});

const ChannelDetailsBar = styled.div({
  gridArea: 'channel-details',
  borderBottom: `1px solid ${Colors.gray_light}`,
  position: 'relative',
  backgroundColor: 'white',
  zIndex: 2,
});

const slideIn = keyframes`
  0% {
    translate: 0 -100%;
  }
  100% {
    translate: 0% 100%;
  }
`;

const slideOut = keyframes`
  0% {
    translate: 0% 100%;
  }
  100% {
    translate: 0% -100%;
  }
`;

const Toolbar = styled.div<{ $showToolbar: boolean }>`
  position: absolute;
  width: 100%;
  bottom: 0;
  animation: ${({ $showToolbar }) => ($showToolbar ? slideIn : slideOut)} 0.5s
    ease;
  translate: ${({ $showToolbar }) => `0% ${$showToolbar ? '100%' : '-100%'}`};
  z-index: 1;
  background-color: white;
  border-top: 1px solid ${Colors.gray_light};
  border-bottom: 1px solid ${Colors.gray_light};
  font-size: 13px;
  color: ${Colors.gray_dark};
  padding: 10px 20px;
`;
// position: absolute;

const StyledThreads = styled(Threads)`
  grid-area: threads;
`;
