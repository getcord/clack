import * as React from 'react';
import { Colors } from './Colors';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { useNavigate } from 'react-router-dom';
import { ChannelButton, Channels } from './channels';
import { NotificationsRequestBanner } from './NotificationsRequestBanner';

type SidebarProps = {
  className?: string;
  channelID: string;
};

export function Sidebar({ className, channelID }: SidebarProps) {
  const navigate = useNavigate();
  const setCurrentChannel = React.useCallback(
    (channel: string) => navigate(`/${channel}`),
    [navigate],
  );
  return (
    <SidebarWrap className={className}>
      <SidebarHeader>Clack</SidebarHeader>
      <Channels
        setCurrentChannel={setCurrentChannel}
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
});

const SidebarHeader = styled(PageHeader)({
  display: 'flex',
  borderBottom: `1px solid ${Colors.purple_border}`,
  borderTop: `1px solid ${Colors.purple_border}`,
  color: 'white',
  position: 'sticky',
  alignItems: 'center',
});
