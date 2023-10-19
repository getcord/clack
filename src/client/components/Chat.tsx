import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { thread, user } from '@cord-sdk/react';
import { HashtagIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import type { Channel } from 'src/client/context/ChannelsContext';
import { PinnedMessages } from 'src/client/components/PinnedMessages';
import { Toolbar } from 'src/client/components/Toolbar';
import { PushPinSvg } from 'src/client/components/svg/PushPinSVG';
import { Colors } from 'src/client/consts/Colors';
import { Threads } from 'src/client/components/Threads';
import { PageHeader } from 'src/client/components/PageHeader';
import { StyledComposer } from 'src/client/components/style/StyledCord';
import { PageUsersLabel } from 'src/client/components/PageUsersLabel';
import { EVERYONE_ORG_ID } from 'src/client/consts/consts';

interface ChatProps {
  channel: Channel;
  onOpenThread: (threadID: string) => void;
}

export function Chat({ channel, onOpenThread }: ChatProps) {
  const { orgMembers, loading, hasMore, fetchMore } = user.useOrgMembers({
    organizationID: channel.org,
  });

  useEffect(() => {
    if (!loading && hasMore) {
      void fetchMore(50);
    }
  }, [orgMembers, hasMore, loading, fetchMore]);

  const { threads: pinnedThreads } = thread.useThreads({
    filter: {
      location: { channel: channel.id },
      metadata: {
        pinned: true,
      },
    },
  });

  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [isAtBottomOfThreads, setIsAtBottomOfThreads] = useState(false);

  const showToolbar = pinnedThreads.length > 0 && isAtBottomOfThreads;

  return (
    <Wrapper>
      <ChannelDetailsBar>
        <PageHeaderWrapper>
          <PageHeader>
            {channel.org === EVERYONE_ORG_ID ? (
              <ChannelIcon />
            ) : (
              <PrivateChannelIcon />
            )}{' '}
            {channel.id}
          </PageHeader>
          {orgMembers && (
            <PageUsersLabel users={orgMembers} channel={channel} />
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
          setIsAtBottomOfThreads(false);
        }}
        onScrollToBottom={() => {
          setIsAtBottomOfThreads(true);
        }}
        channel={channel}
        onOpenThread={onOpenThread}
      />
      <StyledComposer
        location={{ channel: channel.id }}
        threadName={`#${channel.id}`}
        groupId={channel.org}
        showExpanded
      />
    </Wrapper>
  );
}

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

export const ChannelIcon = styled(HashtagIcon)`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;

export const PrivateChannelIcon = styled(LockClosedIcon)`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;
