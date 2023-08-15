import React, { useState } from 'react';
import { styled } from 'styled-components';
import { HashtagIcon } from '@heroicons/react/20/solid';
import { thread } from '@cord-sdk/react';
import { Colors } from 'src/client/consts/Colors';
import { ChannelsRightClickMenu } from 'src/client/components/ChannelsRightClickMenu';
import { Overlay } from 'src/client/components/MoreActionsButton';

export function ChannelButton({
  option,
  onClick,
  onContextMenu,
  isActive,
  icon,
}: {
  option: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: React.ReactNode;
}) {
  const summary = thread.useLocationSummary(
    { channel: option },
    { partialMatch: true },
  );
  const hasUnread = !!summary?.new;

  return (
    <ChannelButtonStyled
      $activePage={isActive}
      onClick={onClick}
      onContextMenu={onContextMenu}
      $hasUnread={hasUnread}
    >
      {icon}
      <ChannelName>{option}</ChannelName>
    </ChannelButtonStyled>
  );
}

export function Channels({
  setCurrentChannel,
  currentChannel,
  channels,
}: {
  setCurrentChannel: (channel: string) => void;
  currentChannel: string;
  channels: string[];
}) {
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuOpenForChannel, setContextMenuOpenForChannel] = useState<
    string | undefined
  >(undefined);

  return (
    <>
      <ChannelsList>
        {channels.map((option, index) => (
          <ChannelButton
            isActive={currentChannel === option}
            key={index}
            onClick={() => setCurrentChannel(option)}
            onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setContextMenuPosition({
                x: e.clientX,
                y: e.clientY,
              });
              setContextMenuOpenForChannel(option);
            }}
            option={option}
            icon={<ChannelIcon />}
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

const ChannelName = styled.span`
  grid-area: channel-name;
  text-align: left;
`;

const ChannelButtonStyled = styled.button<{
  $activePage?: boolean;
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

  color: ${({ $activePage, $hasUnread }) =>
    $activePage || $hasUnread ? 'white' : `${Colors.inactive_channel}`};
  background: ${(props) =>
    props.$activePage ? `${Colors.blue_active}` : `${Colors.purple}`};
  &:hover {
    background: ${(props) =>
      props.$activePage ? `${Colors.blue_active}` : `${Colors.purple_hover}`};
  }
`;

export const ChannelIcon = styled(HashtagIcon)`
  grid-area: hash;
  width: 16px;
  height: 16px;
`;
