import React from 'react';
import { styled } from 'styled-components';
import { Colors } from 'src/client/Colors';
import { Threads } from 'src/client/Threads';
import { PageHeader } from 'src/client/PageHeader';
import { StyledComposer } from 'src/client/StyledCord';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { PageUsersLabel } from 'src/client/PageUsersLabel';

interface ChatProps {
  channel: string;
  onOpenThread: (threadID: string) => void;
}

export function Chat({ channel, onOpenThread }: ChatProps) {
  const usersInChannel = useAPIFetch<(string | number)[]>('/users');

  return (
    <Wrapper>
      <ChannelDetailsBar>
        <PageHeaderWrapper>
          <PageHeader># {channel}</PageHeader>
          {usersInChannel && (
            <PageUsersLabel users={usersInChannel} channel={channel} />
          )}
        </PageHeaderWrapper>
      </ChannelDetailsBar>
      <StyledThreads channel={channel} onOpenThread={onOpenThread} />
      <StyledComposer
        location={{ channel }}
        threadName={`#${channel}`}
        showExpanded
      />
    </Wrapper>
  );
}

const Wrapper = styled.div({
  position: 'relative',
  display: 'grid',
  height: '100%',
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateAreas: `
  "channel-details"
  "threads"
  "composer"`,
  padding: '0',
});

const PageHeaderWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'inherit',
  zIndex: 2,
  margin: 0,
});

const ChannelDetailsBar = styled.div({
  gridArea: 'channel-details',
  borderBottom: `1px solid ${Colors.gray_light}`,
  position: 'relative',
  backgroundColor: 'white',
  zIndex: 2,
});

const StyledThreads = styled(Threads)`
  grid-area: threads;
`;
