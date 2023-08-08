import React, { useEffect, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import { ThreadList, thread } from '@cord-sdk/react';
import { PushPinSvg } from 'src/client/components/svg/PushPinSVG';
import { Colors } from 'src/client/consts/Colors';
import { Threads } from 'src/client/components/Threads';
import { PageHeader } from 'src/client/components/PageHeader';
import { StyledComposer } from 'src/client/components/style/StyledCord';
import { Modal } from 'src/client/components/Modal';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { PageUsersLabel } from 'src/client/components/PageUsersLabel';

interface ChatProps {
  channel: string;
  onOpenThread: (threadID: string) => void;
}

export function Chat({ channel, onOpenThread }: ChatProps) {
  const usersInChannel = useAPIFetch<(string | number)[]>('/users');

  const { threads: pinnedThreads } = thread.useLocationData(
    { channel },
    {
      filter: {
        metadata: {
          pinned: true,
        },
      },
    },
  );

  const [showToolbar, setShowToolbar] = useState(true);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  useEffect(() => {
    setShowToolbar(pinnedThreads.length > 0);
  }, [pinnedThreads]);

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
      <Toolbar $showToolbar={showToolbar}>
        <span
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setShowPinnedMessages(true)}
        >
          <PushPinIcon /> {pinnedThreads.length} Pinned
        </span>
      </Toolbar>
      <PinnedMessages
        channel={channel}
        isOpen={showPinnedMessages}
        onClose={() => setShowPinnedMessages(false)}
      />
      <StyledThreads
        onScrollUp={() => {
          setShowToolbar(false);
        }}
        onScrollToBottom={() => pinnedThreads.length && setShowToolbar(true)}
        channel={channel}
        onOpenThread={onOpenThread}
      />
      <StyledComposer
        location={{ channel }}
        threadName={`#${channel}`}
        showExpanded
      />
    </Wrapper>
  );
}

interface PinnedMessagesProps extends React.ComponentProps<typeof Modal> {
  channel: string;
}
function PinnedMessages({ channel, isOpen, onClose }: PinnedMessagesProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box>
        <ThreadList
          location={{ channel }}
          filter={{ metadata: { pinned: true } }}
          onThreadClick={() => console.log('GO TO THREAD')}
        />
      </Box>
    </Modal>
  );
}

const Box = styled.div({
  position: 'absolute',
  top: '50px',
  width: '300px',
  borderRadius: '8px',
  backgroundColor: Colors.gray_highlight,
  paddingBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
});

const PushPinIcon = styled(PushPinSvg)`
  height: 13px;
  width: 13px;
  margin-right: 6px;
`;

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

const slideIn = keyframes`
  0% {
    translate: 0 -100%;
  }
  100% {
    translate: 0% 100%;
  }
`;

const slideOut = keyframes`
  0% {
    translate: 0% 100%;
  }
  100% {
    translate: 0% -100%;
  }
`;

// top is 18px to sit underneath the channel details bar
const Toolbar = styled.div<{ $showToolbar: boolean }>`
  position: absolute;
  width: 100%;
  top: 18px;
  animation: ${({ $showToolbar }) => ($showToolbar ? slideIn : slideOut)} 0.5s
    ease;
  translate: ${({ $showToolbar: showToolbar }) =>
    `0% ${showToolbar ? '100%' : '-100%'}`};
  z-index: 1;
  background-color: white;
  border-top: 1px solid ${Colors.gray_light};
  border-bottom: 1px solid ${Colors.gray_light};
  font-size: 13px;
  color: ${Colors.gray_dark};
  padding: 10px 20px;
`;

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
