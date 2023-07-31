import * as React from 'react';
import { Colors } from './Colors';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { useNavigate } from 'react-router-dom';
import { ChannelButton, Channels } from './channels';
import { NotificationsRequestBanner } from './NotificationsRequestBanner';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

type SidebarProps = {
  className?: string;
  channelID: string;
  setOpenPanel: (panel: string | null) => void;
  openPanel: string | null;
};

export function Sidebar({
  className,
  channelID,
  setOpenPanel,
  openPanel,
}: SidebarProps) {
  const navigate = useNavigate();
  return (
    <SidebarWrap className={className}>
      <SidebarHeader>Clack</SidebarHeader>
      <Panel>
        <SidebarNavButton
          option={'Threads'}
          onClick={() => {
            navigate('');
            setOpenPanel('threads');
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
        setCurrentChannel={(channel) => {
          setOpenPanel(null);
          navigate(`/${channel}`);
        }}
        currentChannel={channelID}
      />
      <NotificationsRequestBanner />
    </SidebarWrap>
  );
}

const SidebarWrap = styled.div({
  background: Colors.purple,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
});

const SidebarHeader = styled(PageHeader)({
  display: 'flex',
  borderBottom: `1px solid ${Colors.purple_border}`,
  borderTop: `1px solid ${Colors.purple_border}`,
  color: 'white',
  position: 'sticky',
  alignItems: 'center',
});

const SidebarNavButton = styled(ChannelButton)`
  width: 100%;
  margin: 20px 8px;
`;

const Panel = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: ' 20px  8px 0 ',
});

const Divider = styled.div({
  border: `1px solid ${Colors.purple_border}`,
  margin: '20px 0',
});
