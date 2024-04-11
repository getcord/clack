import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import {
  HashtagIcon,
  LockClosedIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { SidebarButton } from 'src/client/components/SidebarButton';
import type { Channel } from 'src/client/consts/Channel';
import { ChannelsRightClickMenu } from 'src/client/components/ChannelsRightClickMenu';
import { Overlay } from 'src/client/components/MoreActionsButton';
import { EVERYONE_ORG_ID } from 'src/client/consts/consts';
import { AddChannelModals } from 'src/client/components/AddChannelModals';
import { ChannelsContext } from 'src/client/context/ChannelsContext';
import { useMutedChannels } from 'src/client/hooks/useMutedChannels';
import { ChannelPicker } from 'src/client/components/ChannelPicker';
import { ChannelThreadCountFetcher } from 'src/client/components/ChannelThreadCountFetcher';

type ChannelWithMute = Channel & { muted: boolean };

export function ChannelButton({
  option,
  onClick,
  onContextMenu,
  isActive,
  icon,
}: {
  option: ChannelWithMute;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: React.ReactNode;
}) {
  const [hasUnread, setHasUnread] = useState<boolean>(
    option.id === 'website-events' ? !option.muted : false,
  );

  return (
    <>
      {option.id !== 'website-events' && !option.muted && (
        <ChannelThreadCountFetcher
          setHasUnread={setHasUnread}
          channelID={option.id}
        />
      )}
      <SidebarButton
        option={option.id}
        isActive={isActive}
        isMuted={option.muted}
        onClick={onClick}
        onContextMenu={onContextMenu}
        hasUnread={hasUnread}
        icon={icon}
      />
    </>
  );
}

export function Channels({
  setCurrentChannelID,
  currentChannel,
}: {
  setCurrentChannelID: (channel: string) => void;
  currentChannel: Channel;
}) {
  const { t } = useTranslation();
  const { channels: unsortedChannels } = useContext(ChannelsContext);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuOpenForChannel, setContextMenuOpenForChannel] = useState<
    Channel | undefined
  >(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const [muted] = useMutedChannels();
  if (muted === undefined) {
    return null;
  }

  const unmutedChannels: ChannelWithMute[] = [];
  const mutedChannels: ChannelWithMute[] = [];
  unsortedChannels.forEach((channel) => {
    if (muted.has(channel.id)) {
      mutedChannels.push({ ...channel, muted: true });
    } else {
      unmutedChannels.push({ ...channel, muted: false });
    }
  });

  const channels = [...unmutedChannels, ...mutedChannels];

  return (
    <>
      <ChannelsList>
        {channels.map((channel) => (
          <ChannelButton
            isActive={currentChannel.id === channel.id}
            key={channel.id}
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
          <AddChannelsButtonText>{t('add_channels')}</AddChannelsButtonText>
        </AddChannelsButton>
        <AddChannelModals isOpen={modalOpen} setModalOpen={setModalOpen} />
        {contextMenuOpenForChannel && (
          <ChannelsRightClickMenu
            position={contextMenuPosition}
            channel={contextMenuOpenForChannel}
            closeMenu={() => setContextMenuOpenForChannel(undefined)}
          ></ChannelsRightClickMenu>
        )}
        <ChannelPicker
          channels={channels}
          onSelect={(id) => setCurrentChannelID(id)}
        />
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
  background: ${(props) => props.theme.channel.add.bg};
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
