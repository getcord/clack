import React, { useState } from 'react';
import { styled } from 'styled-components';
import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { thread } from '@cord-sdk/react';
import { SidebarButton } from 'src/client/components/SidebarButton';
import type { Channel } from 'src/client/consts/Channel';
import { ChannelsRightClickMenu } from 'src/client/components/ChannelsRightClickMenu';
import { Overlay } from 'src/client/components/MoreActionsButton';

export function ChannelButton({
  option,
  onClick,
  onContextMenu,
  isActive,
  icon,
}: {
  option: Channel;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: React.ReactNode;
}) {
  const summary = thread.useLocationSummary(
    { channel: option.id },
    { partialMatch: true, filter: { organizationId: option.org } },
  );
  const hasUnread = !!summary?.new;

  return (
    <SidebarButton
      option={option.id}
      isActive={isActive}
      onClick={onClick}
      onContextMenu={onContextMenu}
      hasUnread={hasUnread}
      icon={icon}
    />
  );
}

export function Channels({
  setCurrentChannelID,
  currentChannel,
  channels,
}: {
  setCurrentChannelID: (channel: string) => void;
  currentChannel: Channel;
  channels: Channel[];
}) {
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuOpenForChannel, setContextMenuOpenForChannel] = useState<
    Channel | undefined
  >(undefined);

  return (
    <>
      <ChannelsList>
        {channels.map((channel, index) => (
          <ChannelButton
            isActive={currentChannel.id === channel.id}
            key={index}
            onClick={() => setCurrentChannelID(channel.id)}
            onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setContextMenuPosition({
                x: e.clientX,
                y: e.clientY,
              });
              setContextMenuOpenForChannel(channel);
            }}
            option={channel}
            icon={channel.org ? <PrivateChannelIcon /> : <ChannelIcon />}
          />
        ))}
        {contextMenuOpenForChannel && (
          <ChannelsRightClickMenu
            position={contextMenuPosition}
            channel={contextMenuOpenForChannel}
            closeMenu={() => setContextMenuOpenForChannel(undefined)}
          ></ChannelsRightClickMenu>
        )}
      </ChannelsList>
      <Overlay
        onClick={() => setContextMenuOpenForChannel(undefined)}
        $shouldShow={!!contextMenuOpenForChannel}
      />
    </>
  );
}

const ChannelsList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 8px;
`;

export const ChannelIcon = styled(HashtagIcon)`
  grid-area: hash;
  width: 16px;
  height: 16px;
`;

export const PrivateChannelIcon = styled(LockClosedIcon)`
  grid-area: hash;
  width: 16px;
  height: 16px;
`;
