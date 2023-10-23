import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { NotificationListLauncher } from '@cord-sdk/react';
import type { Channel } from 'src/client/context/ChannelsContext';
import { Colors } from 'src/client/consts/Colors';
import { PageHeader } from 'src/client/components/PageHeader';
import { Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';

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

  return (
    <SidebarWrap className={className}>
      <SidebarHeader>
        <PageHeader>Clack</PageHeader>
        <StyledNotifLauncher
          onClickNotification={() => setShowSidebar?.(false)}
        />
      </SidebarHeader>
      <ScrollableContent>
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
