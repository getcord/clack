import React from 'react';
import { styled } from 'styled-components';
import { Colors } from 'src/client/consts/Colors';

export function SidebarButton({
  option,
  onClick,
  onContextMenu,
  isActive,
  isMuted,
  hasUnread,
  icon,
}: {
  option: string;
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
      <SidebarButtonName>{option}</SidebarButtonName>
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
  line-height: 28px;
  min-height: 28px;
  font-weight: ${({ $hasUnread }) => ($hasUnread ? '900' : '400')};

  border: none;
  border-radius: 6px;
  cursor: pointer;

  color: ${({ $activePage, $isMuted, $hasUnread }) =>
    $activePage || $hasUnread
      ? 'white'
      : $isMuted
      ? 'gray'
      : `${Colors.inactive_channel}`};
  background: ${(props) =>
    props.$activePage ? `${Colors.blue_active}` : `${Colors.purple}`};
  &:hover {
    background: ${(props) =>
      props.$activePage ? `${Colors.blue_active}` : `${Colors.purple_hover}`};
  }
`;
