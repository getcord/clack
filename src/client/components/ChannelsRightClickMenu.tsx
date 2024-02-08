import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import type { Channel } from 'src/client/context/ChannelsContext';
import { ReactPortal } from 'src/client/components/ReactPortal';
import { useMutedChannels } from 'src/client/hooks/useMutedChannels';

export function ChannelsRightClickMenu({
  position,
  channel,
  closeMenu,
}: {
  position: { x: number; y: number };
  channel: Channel;
  closeMenu: () => void;
}) {
  const [muted, toggleMute] = useMutedChannels();

  const markAsUnread = useCallback(() => {
    void window.CordSDK!.thread.setSeen(
      {
        location: {
          value: { channel: channel.id },
          partialMatch: false,
        },
      },
      true,
    );
    closeMenu();
  }, [channel, closeMenu]);

  if (muted === undefined) {
    return null;
  }

  return (
    <ReactPortal wrapperID={'channels-right-click-menu'}>
      <Menu $x={position.x} $y={position.y}>
        <MenuList>
          <MenuListItem>
            <MenuListItemButton onClick={() => markAsUnread()}>
              Mark all as read
            </MenuListItemButton>
            <MenuListItemButton
              onClick={() => {
                toggleMute(channel.id);
                closeMenu();
              }}
            >
              {muted.has(channel.id) ? 'Unmute' : 'Mute'} channel
            </MenuListItemButton>
          </MenuListItem>
        </MenuList>
      </Menu>
    </ReactPortal>
  );
}

const MenuList = styled.ul`
  list-style: none;
  padding: 12px 0;
  margin: 0;
  width: 180px;
`;

const MenuListItem = styled.li`
  line-height: 28px;
`;

const MenuListItemButton = styled.button`
  cursor: pointer;
  font-size: 15px;
  padding: 0 24px;
  margin: 0;
  border: 0;
  background-color: white;
  min-height: 28px;
  width: 100%;
  text-align: left;
  &:hover {
    background-color: #1264a3;
    color: white;
  }
`;

const Menu = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  pointer-events: auto;
  background-color: #fff;
  border-radius: 6px;
  box-shadow:
    0 0 0 1px rgba(29, 28, 29, 0.13),
    0 4px 12px 0 #0000001f;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
`;
