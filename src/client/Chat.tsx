import React, { useState } from 'react';
import { notification } from '@cord-sdk/react';
import { styled, keyframes } from 'styled-components';
import { Colors } from './Colors';
import { Threads } from './Threads';
import { showNotification } from 'src/client/notifications';
import { PageHeader } from './PageHeader';
import { StyledComposer } from './StyledCord';

interface ChatProps {
  channel: string;
  onOpenThread: (threadID: string) => void;
}

export function Chat({ channel, onOpenThread }: ChatProps) {
  const [showToolbar, setShowToolbar] = useState(true);
  // Maybe not the right place for this but when I had it up at the top it was
  // angry that it wasn't being used inside the CordProvider
  // Also doesn't work as expected I think because notifications are not marked as seen when
  // their corresponding messages are marked as seen... todo...
  const summary = notification.useSummary();

  const oldNotificationCount = React.useRef(summary?.unread ?? null);

  if (summary?.unread !== undefined) {
    // Hook has loaded data - initialise ref
    if (oldNotificationCount.current === null) {
      oldNotificationCount.current = summary.unread;
      // Don't send notification for the first load, even if there are new messages?
      // Reasoning is that you will already see them, since you actively just logged in
      // and so a notification will be unnecessary/annoying
    }

    // Or compare to existing value to see if it's increased
    if (summary.unread > oldNotificationCount.current) {
      showNotification();
    }
  }

  return (
    <Wrapper>
      <ChannelDetailsBar>
        <PageHeader># {channel}</PageHeader>
        <Toolbar showToolbar={showToolbar}> + Add a bookmark</Toolbar>
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

const Toolbar = styled.div<{ showToolbar: boolean }>`
  position: absolute;
  width: 100%;
  bottom: 0;
  animation: ${({ showToolbar }) => (showToolbar ? slideIn : slideOut)} 0.5s
    ease;
  translate: ${({ showToolbar }) => `0% ${showToolbar ? '100%' : '-100%'}`};
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
