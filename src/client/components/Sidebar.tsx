import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { NotificationListLauncher } from '@cord-sdk/react';
import { SidebarButton } from 'src/client/components/SidebarButton';
import type { Channel } from 'src/client/context/ChannelsProvider';
import { Colors } from 'src/client/consts/Colors';
import { PageHeader } from 'src/client/components/PageHeader';
import { Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';

type SidebarProps = {
  className?: string;
  channel: Channel;
  allChannels: Channel[];
  openPanel: string | null;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({
  className,
  channel,
  allChannels,
  openPanel,
  setShowSidebar,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <SidebarWrap className={className}>
      <SidebarHeader>
        <PageHeader>Clack</PageHeader>
        <StyledNotifLauncher />
      </SidebarHeader>
      <ScrollableContent>
        <Panel>
          <ThreadsButton
            option={'Threads'}
            onClick={() => {
              navigate('/threads/');
            }}
            icon={
              <ChatBubbleOvalLeftEllipsisIcon
                style={{ width: '20px', height: '20px' }}
              />
            }
            isActive={openPanel === 'threads'}
            hasUnread={false}
          />
        </Panel>
        <Divider />
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

const ThreadsButton = styled(SidebarButton)`
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
