import * as React from 'react';
import { Colors } from './Colors';
import { styled } from 'styled-components';
import { PageHeader } from './PageHeader';
import { useNavigate } from 'react-router-dom';
import { Channels } from './channels';

type SidebarProps = {
  className?: string;
  channelID: string;
};

export function Sidebar({ className, channelID }: SidebarProps) {
  const navigate = useNavigate();
  return (
    <SidebarWrap className={className}>
      <SidebarHeader>Clack</SidebarHeader>
      <Channels
        setCurrentChannel={(channel) => navigate(`/${channel}`)}
        currentChannel={channelID}
      />
    </SidebarWrap>
  );
}

const SidebarWrap = styled.div({ background: Colors.purple });

const SidebarHeader = styled(PageHeader)({
  display: 'flex',
  borderBottom: `1px solid ${Colors.purple_border}`,
  borderTop: `1px solid ${Colors.purple_border}`,
  color: 'white',
  position: 'sticky',
  alignItems: 'center',
});
