import React from 'react';
import { styled } from 'styled-components';
import { Colors } from 'src/client/consts/Colors';

export function SidebarButton({
  displayName,
  onClick,
  onContextMenu,
  isActive,
  isMuted,
  hasUnread,
  icon,
}: {
  displayName: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  isMuted: boolean;
  hasUnread: boolean;
  icon: React.ReactNode;
}) {
  return (
    <SidebarButtonStyled
      $activePage={isActive}
      onClick={onClick}
      onContextMenu={onContextMenu}
      $isMuted={isMuted}
      $hasUnread={hasUnread}
    >
      {icon}
      <SidebarButtonName>{displayName}</SidebarButtonName>
    </SidebarButtonStyled>
  );
}

const SidebarButtonName = styled.span`
  grid-area: channel-name;
  text-align: left;
`;

const SidebarButtonStyled = styled.button<{
  $activePage?: boolean;
  $isMuted?: boolean;
  $hasUnread?: boolean;
}>`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'hash channel-name';
  grid-gap: 8px;
  padding: 0 10px 0 16px;

  font-size: 15px;
  line-height: 20px;
  min-height: 28px;
  font-weight: ${({ $hasUnread }) => ($hasUnread ? '900' : '400')};

  border: none;
  border-radius: 6px;
  cursor: pointer;

  color: ${({ $activePage, $hasUnread }) =>
    $activePage || $hasUnread ? 'white' : `${Colors.inactive_channel}`};
  background: ${(props) =>
    props.$activePage ? props.theme.channel.active.bg : props.theme.channel.bg};
  ${({ $isMuted }) => $isMuted && 'opacity: 0.5;'}
  &:hover {
    background: ${(props) =>
      props.$activePage
        ? props.theme.channel.active.bg
        : props.theme.channel.hover.bg};
  }
`;
