import React from 'react';
import { notification } from '@cord-sdk/react';
import { styled } from 'styled-components';
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
      </ChannelDetailsBar>
      <Toolbar> + Add a bookmark</Toolbar>
      <StyledThreads channel={channel} onOpenThread={onOpenThread} />
      <StyledComposer location={{ channel }} showExpanded />
    </Wrapper>
  );
}

const Wrapper = styled.div({
  display: 'grid',
  height: '100%',
  gridTemplateRows: 'auto auto 1fr auto',
  gridTemplateAreas: `
  "channel-details"
  "toolbar"
  "threads"
  "composer"`,
  padding: '0',
});

const ChannelDetailsBar = styled.div({
  gridArea: 'channel-details',
});

const Toolbar = styled.div({
  gridArea: 'toolbar',
  backgroundColor: 'white',
  borderBottom: `1px solid ${Colors.gray_light}`,
  borderTop: `1px solid ${Colors.gray_light}`,
  fontSize: '13px',
  color: Colors.gray_dark,
  padding: '10px 20px',
});

const StyledThreads = styled(Threads)`
  grid-area: threads;
`;
