import * as React from 'react';
import { Colors } from 'src/client/Colors';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { styled } from 'styled-components';
import { HashtagIcon } from '@heroicons/react/20/solid';
import { thread } from '@cord-sdk/react';

function ChannelButton({
  option,
  onClick,
  isActive,
}: {
  option: string;
  onClick: () => void;
  isActive: boolean;
}) {
  const summary = thread.useLocationSummary(
    { channel: option },
    { partialMatch: true },
  );
  const hasUnread = !!summary?.unread;

  return (
    <ChannelButtonStyled
      $activePage={isActive}
      onClick={onClick}
      hasUnread={hasUnread}
    >
      <ChannelIcon /> <span> {option}</span>
    </ChannelButtonStyled>
  );
}

export function Channels({
  setCurrentChannel,
  currentChannel,
}: {
  setCurrentChannel: (channel: string) => void;
  currentChannel: string;
}) {
  const channelsOptions = useAPIFetch<string[]>('/channels') ?? [];
  return (
    <ChannelsList>
      {channelsOptions.map((option, index) => (
        <ChannelButton
          isActive={currentChannel === option}
          key={index}
          onClick={() => setCurrentChannel(option)}
          option={option}
        />
      ))}
    </ChannelsList>
  );
}

const ChannelsList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 8px;
`;

const ChannelButtonStyled = styled.button<{
  $activePage?: boolean;
  hasUnread?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 15px;
  line-height: 28px;
  min-heght: 28px;
  font-weight: ${({ hasUnread }) => (hasUnread ? '900' : '400')};

  border: none;
  border-radius: 6px;
  cursor: pointer;

  color: ${({ $activePage, hasUnread }) =>
    $activePage || hasUnread ? 'white' : `${Colors.text}`};
  background: ${(props) =>
    props.$activePage ? `${Colors.blue_active}` : `${Colors.purple}`};
  &:hover {
    background: ${(props) =>
      props.$activePage ? `${Colors.blue_active}` : `${Colors.purple_hover}`};
  }
`;

const ChannelIcon = styled(HashtagIcon)`
  width: 16px;
  height: 16px;
`;
