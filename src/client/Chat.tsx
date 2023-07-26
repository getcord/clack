import React from 'react';
import { Composer, notification } from '@cord-sdk/react';
import { styled } from 'styled-components';
import { Colors } from './Colors';
import { Messages } from './Messages';
import { showNotification } from 'src/client/notifications';

interface ChatProps {
  channel: string;
}

export function Chat({ channel }: ChatProps) {
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
      // The data says there are new notifications
      if (summary.unread > 0) {
        showNotification();
      }
      return;
    }

    // Or compare to existing value to see if it's increased
    if (summary.unread > oldNotificationCount.current) {
      showNotification();
      return;
    }
  }

  return (
    <Wrapper>
      <ChannelDetailsBar>
        <ChannelName># {channel}</ChannelName>
      </ChannelDetailsBar>
      <Toolbar> + Add a bookmark</Toolbar>
      <StyledMessages channel={channel} />
      <StyledComposer location={{ channel }} showExpanded />
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
  borderBottom: `1px solid ${Colors.light_gray}`,
  borderTop: `1px solid ${Colors.light_gray}`,
  fontSize: '13px',
  color: Colors.dark_gray,
  padding: '10px 20px',
});

const StyledMessages = styled(Messages)`
  grid-area: messages;
`;

const StyledComposer = styled(Composer)`
  grid-area: composer;
  padding: 0 20px 20px;
`;
