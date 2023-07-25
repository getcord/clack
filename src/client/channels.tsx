import * as React from 'react';
import { Colors } from 'src/client/Colors';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { styled } from 'styled-components';
import { HashtagIcon } from '@heroicons/react/20/solid';

export function Channels({
  setCurrentChannel,
  currentChannel,
}: {
  setCurrentChannel: (channel: string) => void;
  currentChannel: string;
}) {
  const channelsOptions = useAPIFetch<string[]>('/channels') ?? [];
  console.log({ channelsOptions });
  return (
    <ChannelsList>
      {channelsOptions.map((option, index) => (
        <ChannelButton
          $activePage={currentChannel === option}
          key={index}
          onClick={() => setCurrentChannel(option)}
        >
          <ChannelIcon /> <span> {option}</span>
        </ChannelButton>
      ))}
    </ChannelsList>
  );
}

const ChannelsList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;

const ChannelButton = styled.button<{ $activePage?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 15px;
  line-height: 28px;
  min-heght: 28px;

  border: none;
  border-radius: 6px;
  cursor: pointer;

  color: ${(props) => (props.$activePage ? 'white' : `${Colors.text}`)};
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
