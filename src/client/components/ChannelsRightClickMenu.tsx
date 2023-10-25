import React, { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import { thread } from '@cord-sdk/react';
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
  const [threadIDs, setThreadIDs] = useState<Set<string>>(new Set());
  const [shouldMarkAsUnread, setShouldMarkAsUnread] = useState(false);
  const [muted, toggleMute] = useMutedChannels();

  const { threads, hasMore, fetchMore, loading } = thread.useThreads({
    filter: {
      location: { channel: channel.id },
    },
    sortBy: 'first_message_timestamp',
    sortDirection: 'descending',
  });

  // Don't currently have a way to load just unread threads, so load a fair chunk
  // of recent threads, since presumably newer ones are the ones showing as unread
  // (NB the WHOLE thread has to be unread to make the channel title bold, so doesn't
  // matter if old threads get new messages)
  useEffect(() => {
    threads.forEach((thread) => {
      if (!threadIDs.has(thread.id)) {
        setThreadIDs(new Set([...threadIDs, thread.id]));
      }
    });

    if (hasMore && !loading && threadIDs.size < 25) {
      void fetchMore(25);
    }
  }, [fetchMore, hasMore, loading, threadIDs, threads]);

  // In case we haven't loaded the threads yet, don't actually carry out the
  // action when the button is clicked, but after the button has been clicked and
  // we think our loading is done
  useEffect(() => {
    if (!shouldMarkAsUnread || loading || (threadIDs.size < 25 && hasMore)) {
      return;
    }
    threadIDs.forEach((id) => {
      void window.CordSDK!.thread.setSeen(id, true);
    });
    setShouldMarkAsUnread(false);
    closeMenu();
  }, [closeMenu, hasMore, loading, shouldMarkAsUnread, threadIDs]);

  if (muted === undefined) {
    return null;
  }

  return (
    <ReactPortal wrapperID={'channels-right-click-menu'}>
      <Menu $x={position.x} $y={position.y}>
        <MenuList>
          <MenuListItem>
            <MenuListItemButton onClick={() => setShouldMarkAsUnread(true)}>
              Mark all as read
            </MenuListItemButton>
            <MenuListItemButton onClick={() => toggleMute(channel.id)}>
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
