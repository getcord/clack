import React, { useState } from 'react';
import { styled } from 'styled-components';
import {
  HashtagIcon,
  LockClosedIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { thread } from '@cord-sdk/react';
import { SidebarButton } from 'src/client/components/SidebarButton';
import type { Channel } from 'src/client/consts/Channel';
import { ChannelsRightClickMenu } from 'src/client/components/ChannelsRightClickMenu';
import { Overlay } from 'src/client/components/MoreActionsButton';
import { EVERYONE_ORG_ID } from 'src/client/consts/consts';
import { Colors } from 'src/client/consts/Colors';
import { AddChannelModals } from 'src/client/components/AddChannelModals';

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
  const counts = thread.useThreadCounts({
    filter: {
      location: {
        matcher: { channel: option.id },
        partialMatch: true,
      },
    },
  });
  const hasUnread = !!counts?.new;

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
  const [modalOpen, setModalOpen] = useState(false);

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
            icon={
              channel.org === EVERYONE_ORG_ID ? (
                <ChannelIcon />
              ) : (
                <PrivateChannelIcon />
              )
            }
          />
        ))}
        <AddChannelsButton onClick={() => setModalOpen(true)}>
          <PlusIconWrapper>
            <PlusIcon width={12} />
          </PlusIconWrapper>
          <AddChannelsButtonText>Add channels</AddChannelsButtonText>
        </AddChannelsButton>
        <AddChannelModals isOpen={modalOpen} setModalOpen={setModalOpen} />
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

const AddChannelsButtonText = styled.span`
  grid-area: channel-name;
  text-align: left;
`;

const PlusIconWrapper = styled.div({
  alignItems: 'center',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: '4px',
  display: 'flex',
  height: '20px',
  justifyContent: 'center',
  width: '20px',
});

const AddChannelsButton = styled.button`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'hash channel-name';
  grid-gap: 8px;
  padding: 0 10px 0 16px;

  font-size: 15px;
  line-height: 28px;
  min-height: 28px;
  font-weight: 400;

  border: none;
  border-radius: 6px;
  cursor: pointer;

  color: #ffffffb3;
  background: ${Colors.purple};
`;

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
