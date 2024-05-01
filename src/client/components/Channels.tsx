import React, { useCallback, useContext, useState } from 'react';
import { styled } from 'styled-components';
import {
  ChatBubbleLeftRightIcon,
  HashtagIcon,
  LockClosedIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { SidebarButton } from 'src/client/components/SidebarButton';
import type { Channel } from 'src/client/consts/Channel';
import { ChannelsRightClickMenu } from 'src/client/components/ChannelsRightClickMenu';
import { Overlay } from 'src/client/components/MoreActionsButton';
import { EVERYONE_ORG_ID, isDirectMessageChannel } from 'src/common/consts';
import { AddChannelModals } from 'src/client/components/AddChannelModals';
import { ChannelsContext } from 'src/client/context/ChannelsContext';
import { useMutedChannels } from 'src/client/hooks/useMutedChannels';
import { ChannelPicker } from 'src/client/components/ChannelPicker';
import { ChannelThreadCountFetcher } from 'src/client/components/ChannelThreadCountFetcher';
import { AddDirectMessageModal } from 'src/client/components/AddDirectMessageModal';

type ChannelWithMute = Channel & { muted: boolean };

function ChannelButton({
  channel,
  onClick,
  onContextMenu,
  isActive,
  icon,
}: {
  channel: ChannelWithMute;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: React.ReactNode;
}) {
  const [hasUnread, setHasUnread] = useState<boolean>(
    channel.id === 'website-events' ? !channel.muted : false,
  );

  return (
    <>
      {channel.id !== 'website-events' && !channel.muted && (
        <ChannelThreadCountFetcher
          setHasUnread={setHasUnread}
          channelID={channel.id}
        />
      )}
      <SidebarButton
        displayName={channel.name}
        isActive={isActive}
        isMuted={channel.muted}
        onClick={onClick}
        onContextMenu={onContextMenu}
        hasUnread={hasUnread}
        icon={icon}
      />
    </>
  );
}

function DmButton({
  channel,
  onClick,
  onContextMenu,
  isActive,
}: {
  channel: ChannelWithMute;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
}) {
  return (
    <ChannelButton
      channel={channel}
      onClick={onClick}
      onContextMenu={onContextMenu}
      isActive={isActive}
      icon={<DirectMessageIcon />}
    />
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
  const [addChannelModalOpen, setAddChannelModalOpen] = useState(false);
  const [addDirectMessageModalOpen, setAddDirectMessageModalOpen] =
    useState(false);

  const onContextMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, channel: ChannelWithMute) => {
      e.preventDefault();
      setContextMenuPosition({
        x: e.clientX,
        y: e.clientY,
      });
      setContextMenuOpenForChannel(channel);
    },
    [],
  );

  const [muted] = useMutedChannels();
  if (muted === undefined) {
    return null;
  }

  const unmutedChannels: ChannelWithMute[] = [];
  const mutedChannels: ChannelWithMute[] = [];
  const dms: ChannelWithMute[] = [];
  unsortedChannels.forEach((channel) => {
    if (isDirectMessageChannel(channel.id)) {
      dms.push({ ...channel, muted: false });
    } else if (muted.has(channel.id)) {
      mutedChannels.push({ ...channel, muted: true });
    } else {
      unmutedChannels.push({ ...channel, muted: false });
    }
  });

  const channels = [...unmutedChannels, ...mutedChannels];
  dms.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <ChannelsList>
        {channels.map((channel) => (
          <ChannelButton
            isActive={currentChannel.id === channel.id}
            key={channel.id}
            onClick={() => setCurrentChannelID(channel.id)}
            onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) =>
              onContextMenu(e, channel)
            }
            channel={channel}
            icon={
              channel.org === EVERYONE_ORG_ID ? (
                <ChannelIcon />
              ) : (
                <PrivateChannelIcon />
              )
            }
          />
        ))}
        <AddChannelsButton onClick={() => setAddChannelModalOpen(true)}>
          <PlusIconWrapper>
            <PlusIcon width={12} />
          </PlusIconWrapper>
          <AddChannelsButtonText>{t('add_channels')}</AddChannelsButtonText>
        </AddChannelsButton>
        <AddChannelModals
          isOpen={addChannelModalOpen}
          setModalOpen={setAddChannelModalOpen}
        />
        {dms.map((dm) => (
          <DmButton
            key={dm.id}
            channel={dm}
            onClick={() => setCurrentChannelID(dm.id)}
            onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) =>
              onContextMenu(e, dm)
            }
            isActive={currentChannel.id === dm.id}
          />
        ))}
        <AddChannelsButton onClick={() => setAddDirectMessageModalOpen(true)}>
          <PlusIconWrapper>
            <PlusIcon width={12} />
          </PlusIconWrapper>
          <AddChannelsButtonText>
            {t('add_direct_message')}
          </AddChannelsButtonText>
        </AddChannelsButton>
        <AddDirectMessageModal
          isOpen={addDirectMessageModalOpen}
          setModalOpen={setAddDirectMessageModalOpen}
        />
        {contextMenuOpenForChannel && (
          <ChannelsRightClickMenu
            position={contextMenuPosition}
            channel={contextMenuOpenForChannel}
            closeMenu={() => setContextMenuOpenForChannel(undefined)}
          ></ChannelsRightClickMenu>
        )}
        <ChannelPicker
          channels={unsortedChannels}
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

const PrivateChannelIcon = styled(LockClosedIcon)`
  grid-area: hash;
  width: 16px;
  height: 16px;
`;

const DirectMessageIcon = styled(ChatBubbleLeftRightIcon)`
  grid-area: hash;
  width: 16px;
  height: 16px;
`;
