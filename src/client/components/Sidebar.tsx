import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  EnvelopeOpenIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
  EyeSlashIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { NotificationListLauncher, thread } from '@cord-sdk/react';
import type { ThreadActivitySummary } from '@cord-sdk/types';
import type { Channel } from 'src/client/context/ChannelsContext';
import { Colors } from 'src/client/consts/Colors';
import { PageHeader } from 'src/client/components/PageHeader';
import { Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';
import { SidebarButton } from 'src/client/components/SidebarButton';

type SidebarProps = {
  className?: string;
  channel: Channel;
  allChannels: Channel[];
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({
  className,
  channel,
  allChannels,
  setShowSidebar,
}: SidebarProps) {
  const navigate = useNavigate();
  const counts = thread.useThreadCounts({
    filter: {
      location: {
        matcher: { channel: channel.id },
        partialMatch: true,
      },
      organizationID: channel.org,
    },
  });

  const countsArray = counts
    ? (Object.keys(counts) as (keyof ThreadActivitySummary)[]).map(
        (key: keyof ThreadActivitySummary) => ({
          countType: key,
          amount: counts[key],
        }),
      )
    : undefined;

  return (
    <SidebarWrap className={className}>
      <SidebarHeader>
        <PageHeader>Clack</PageHeader>
        <StyledNotifLauncher />
      </SidebarHeader>
      <ScrollableContent>
        <Panel>
          {countsArray?.map((count, i) => {
            return (
              <PanelButton
                key={i}
                option={count.countType}
                onClick={() => {
                  const message = `
We're testing the new 'thread.useThreadsCounts' API to make sure 
the implementation is simple.

The count number displayed should be based on the channel 
you're currently viewing.
  `;
                  window.alert(message);
                }}
                icon={
                  <ThreadCountsIcon
                    type={count.countType}
                    style={{ width: '20px', height: '20px' }}
                  />
                }
                isActive={false}
                hasUnread={false}
                count={count.amount}
              />
            );
          })}

          <Divider />
        </Panel>
        <Channels
          setCurrentChannelID={(channelID) => {
            navigate(`/channel/${channelID}`);
            setShowSidebar?.(false);
          }}
          currentChannel={channel}
          channels={allChannels}
        />
      </ScrollableContent>
      <NotificationsRequestBanner />
    </SidebarWrap>
  );
}

const SidebarWrap = styled.div({
  background: Colors.purple,
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gridTemplateAreas: `
  "header" 
  "content"
  `,
  position: 'relative',
  overflow: 'hidden',
});

const ScrollableContent = styled.div({
  overflow: 'auto',
});

const SidebarHeader = styled.div({
  gridArea: 'header',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${Colors.purple_border}`,
  borderTop: `1px solid ${Colors.purple_border}`,
  color: 'white',
  alignItems: 'center',
});

const StyledNotifLauncher = styled(NotificationListLauncher)({
  padding: '0 16px',
});

const PanelButton = styled(SidebarButton)`
  width: 100%;
  margin: 20px 8px;
`;

const Panel = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 8px 0',
});

const Divider = styled.div({
  border: `1px solid ${Colors.purple_border}`,
  margin: '20px 0',
});

const ThreadCountsIcon = ({
  type,
  style,
}: {
  type: keyof ThreadActivitySummary;
  style: React.CSSProperties;
}) => {
  switch (type) {
    case 'total':
      return <ChatBubbleLeftRightIcon style={style} />;

    case 'unread':
      return <EnvelopeIcon style={style} />;

    case 'unreadSubscribed':
      return <EyeSlashIcon style={style} />;

    case 'new':
      return <BellIcon style={style} />;

    case 'resolved':
      return <CheckBadgeIcon style={style} />;

    default:
      return <EnvelopeOpenIcon style={style} />;
  }
};
