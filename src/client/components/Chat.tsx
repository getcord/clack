import React, { useContext, useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { thread, user, betaV2 } from '@cord-sdk/react';
import {
  ChatBubbleLeftRightIcon,
  HashtagIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import type { Channel } from 'src/client/consts/Channel';
import { PinnedMessages } from 'src/client/components/PinnedMessages';
import { Toolbar } from 'src/client/components/Toolbar';
import { PushPinSvg } from 'src/client/components/svg/PushPinSVG';
import { Threads } from 'src/client/components/Threads';
import { PageHeader } from 'src/client/components/PageHeader';
import {
  StyledComposer,
  StyledExperimentalComposer,
} from 'src/client/components/style/StyledCord';
import { PageUsersLabel } from 'src/client/components/PageUsersLabel';
import { EVERYONE_ORG_ID, isDirectMessageChannel } from 'src/common/consts';
import { SnowFall } from 'src/client/components/SnowFall';
import type { ClackTheme } from 'src/client/consts/theme';
import { Spring } from 'src/client/components/SpringFall';
import { CordVersionContext } from 'src/client/context/CordVersionContext';
import { ClackSendButton } from 'src/client/components/ClackSendButton';

interface ChatProps {
  channel: Channel;
  onOpenThread: (threadID: string) => void;
  clackTheme: ClackTheme;
}

const REPLACE = { SendButton: ClackSendButton };

export function Chat({ channel, onOpenThread, clackTheme }: ChatProps) {
  const { t } = useTranslation();
  const { groupMembers, loading, hasMore, fetchMore } = user.useGroupMembers({
    groupID: channel.org,
  });

  useEffect(() => {
    if (!loading && hasMore) {
      void fetchMore(50);
    }
  }, [groupMembers, hasMore, loading, fetchMore]);

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

  const channelIcon = isDirectMessageChannel(channel.id) ? (
    <DirectMessageIcon />
  ) : channel.org === EVERYONE_ORG_ID ? (
    <ChannelIcon />
  ) : (
    <PrivateChannelIcon />
  );

  const cordVersionContext = useContext(CordVersionContext);

  const createThreadOptions = useMemo(() => {
    return {
      name: `#${channel.name}`,
      location: { channel: channel.id },
      // This is not always the right url, but the navigate prop in
      // CordProvider makes sure that clicking on notifications takes
      // to the right place. We cannot pass an empty url because then
      // the navigate function won't be called (we should fix that)
      url: window.location.href,
      groupID: channel.org,
    };
  }, [channel.id, channel.name, channel.org]);

  return (
    <Wrapper>
      <ChannelDetailsBar>
        <PageHeaderWrapper>
          <ChannelDetailsHeader>
            {channel.org && (
              <>
                {channelIcon}
                {channel.name}
              </>
            )}
          </ChannelDetailsHeader>
          {groupMembers && (
            <PageUsersLabel users={groupMembers} channel={channel} />
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
          <PushPinIcon /> {t('pinned_threads', { count: pinnedThreads.length })}
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
      {cordVersionContext.version === '3.0' ? (
        <StyledComposer
          location={{ channel: channel.id }}
          threadName={`#${channel.name}`}
          groupId={channel.org}
          showExpanded
        />
      ) : (
        <betaV2.Replace replace={REPLACE}>
          <StyledExperimentalComposer createThread={createThreadOptions} />
        </betaV2.Replace>
      )}
      {clackTheme === 'winter' && <SnowFall />}
      {clackTheme === 'spring' && <Spring />}
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

const ChannelDetailsBar = styled.div`
  grid-area: channel-details;
  border-bottom: ${(props) => `1px solid ${props.theme.chat.border}`};
  position: relative;
  background-color: ${(props) => props.theme.chat.details.bg};
  z-index: 2;
`;

const StyledThreads = styled(Threads)`
  grid-area: threads;
`;

const ChannelIcon = styled(HashtagIcon)`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;

const PrivateChannelIcon = styled(LockClosedIcon)`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;

const DirectMessageIcon = styled(ChatBubbleLeftRightIcon)`
  margin-right: 4px;
  width: 16px;
  height: 16px;
`;

export const ChannelDetailsHeader = styled(PageHeader)`
  color: ${(props) => props.theme.chat.details.header};
`;
