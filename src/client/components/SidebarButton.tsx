import React from 'react';
import { styled } from 'styled-components';
import { Colors } from 'src/client/consts/Colors';

export function SidebarButton({
  option,
  onClick,
  onContextMenu,
  isActive,
  hasUnread,
  icon,
  count,
}: {
  option: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  hasUnread: boolean;
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <SidebarButtonStyled
      $activePage={isActive}
      onClick={onClick}
      onContextMenu={onContextMenu}
      $hasUnread={hasUnread}
    >
      {icon}
      <SidebarButtonName>{option}</SidebarButtonName>
      <SidebarButtonCount>{count}</SidebarButtonCount>
    </SidebarButtonStyled>
  );
}

const SidebarButtonName = styled.span`
  grid-area: channel-name;
  text-align: left;
`;
const SidebarButtonCount = styled.span`
  grid-area: channel-count;
`;

const SidebarButtonStyled = styled.button<{
  $activePage?: boolean;
  $hasUnread?: boolean;
}>`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'hash channel-name channel-count';
  grid-gap: 8px;
  padding: 0 10px 0 16px;

  font-size: 15px;
  line-height: 28px;
  min-height: 28px;
  font-weight: ${({ $hasUnread }) => ($hasUnread ? '900' : '400')};

  border: none;
  border-radius: 6px;
  cursor: pointer;

  color: ${({ $activePage, $hasUnread }) =>
    $activePage || $hasUnread ? 'white' : `${Colors.inactive_channel}`};
  background: ${(props) =>
    props.$activePage ? `${Colors.blue_active}` : `${Colors.purple}`};
  &:hover {
    background: ${(props) =>
      props.$activePage ? `${Colors.blue_active}` : `${Colors.purple_hover}`};
  }
`;
