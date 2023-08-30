import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { NotificationListLauncher } from '@cord-sdk/react';
import type { Channel } from 'src/client/consts/Channel';
import { Colors } from 'src/client/consts/Colors';
import { PageHeader } from 'src/client/components/PageHeader';
import { ChannelButton, Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';

type SidebarProps = {
  className?: string;
  channel: Channel;
  openPanel: string | null;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({
  className,
  channel,
  openPanel,
  setShowSidebar,
}: SidebarProps) {
  const navigate = useNavigate();

  // API call here so it doesn't rerun when context menu is opened
  const channelsOptions = useAPIFetch<string[]>('/channels') ?? [];

  return (
    <SidebarWrap className={className}>
      <SidebarHeader>
        <PageHeader>Clack</PageHeader>
        <StyledNotifLauncher />
      </SidebarHeader>
      <ScrollableContent>
        <Panel>
          <SidebarNavButton
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
          />
        </Panel>
        <Divider />
        <Channels
          setCurrentChannelID={(channelID) => {
            navigate(`/channel/${channelID}`);
            setShowSidebar?.(false);
          }}
          currentChannel={channel}
          channels={channelsOptions}
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

const SidebarNavButton = styled(ChannelButton)`
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
