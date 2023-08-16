import * as React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { NotificationListLauncher } from '@cord-sdk/react';
import { Colors } from 'src/client/consts/Colors';
import { PageHeader } from 'src/client/components/PageHeader';
import { ChannelButton, Channels } from 'src/client/components/Channels';
import { NotificationsRequestBanner } from 'src/client/components/NotificationsRequestBanner';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';

type SidebarProps = {
  className?: string;
  channelID: string;
  openPanel: string | null;
};

export function Sidebar({ className, channelID, openPanel }: SidebarProps) {
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
              // check if we're editing a message
              // show modal if we are, to prevent losing changes
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
          setCurrentChannel={(channel) => navigate(`/channel/${channel}`)}
          currentChannel={channelID}
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
