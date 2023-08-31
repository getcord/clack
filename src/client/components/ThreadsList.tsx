import React from 'react';
import { styled } from 'styled-components';
import type { CoreThreadData } from '@cord-sdk/types';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { ChannelIcon } from 'src/client/components/Channels';
import { StyledThread } from 'src/client/components/style/StyledCord';
import { FRONT_END_HOST } from 'src/client/consts/consts';
import { TypingIndicator } from 'src/client/components/TypingIndicator';

export function ThreadsList({ cordUserID }: { cordUserID?: string }) {
  const [myThreads, setMyThreads] = React.useState<
    CoreThreadData[] | undefined
  >();
  const allThreads = useAPIFetch<any[]>('/threads');
  React.useEffect(() => {
    if (!allThreads) {
      return;
    }

    if (allThreads.length < 1) {
      setMyThreads([]);
      return;
    }
    const filteredThreads = allThreads.filter((thread) => {
      // slack 'participants' are people who've replied to a thread or been metioned
      // cord 'participants' are people who've viewed or interacted with a thread in any way
      return thread.participants.some(
        // notes: says date-time | null in docs
        // do this in the backend instead
        (participant: { lastSeenTimestamp: string | null; userID: string }) => {
          return participant.userID === cordUserID;
        },
      );
    });
    setMyThreads(filteredThreads);
  }, [allThreads, cordUserID]);

  return (
    <Wrapper>
      <Header>
        <ChannelName>Threads</ChannelName>
      </Header>
      <ThreadsWrapper>
        {myThreads ? (
          myThreads.length > 0 ? (
            myThreads.map((thread, index) => {
              return (
                <ThreadWrapper key={index}>
                  <Participants>
                    <ThreadLocationWrapper
                      href={`${FRONT_END_HOST}/channel/${thread.location.channel}/thread/${thread.id}`}
                    >
                      <ChannelIcon />
                      <ThreadLocation>{thread.location.channel}</ThreadLocation>
                    </ThreadLocationWrapper>
                    <SubText>Dave Miller and Flooey</SubText>
                  </Participants>
                  {/* tried to use threads here to see how far we can get with customising */}
                  <StyledThread
                    threadId={thread.id}
                    composerExpanded={true}
                    style={{
                      // for some reason, .cord-thread doesn't work
                      borderRadius: '12px',
                    }}
                  />
                  <TypingIndicator
                    threadID={thread.id}
                    organizationId={thread.organizationID}
                  />
                </ThreadWrapper>
              );
            })
          ) : (
            <NoThreads>
              <img
                src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/apple-large/1f331@2x.png"
                style={{
                  padding: '40px',
                  maxHeight: '140px',
                  maxWidth: '290px',
                }}
              />
              <ThreadLocation>Look after your threads</ThreadLocation>
              <p>Threads you’re involved in will be collected right here.</p>
            </NoThreads>
          )
        ) : (
          <NoThreads>
            <ThreadLocation>Loading...</ThreadLocation>
          </NoThreads>
        )}
      </ThreadsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const Header = styled.div({
  padding: '0 16px 0 20px',
});

const Participants = styled.div({
  background: 'transparent',
  margin: '16px 28px 12px 12px',
});

const ThreadLocationWrapper = styled.a({
  display: 'flex',
  alignItems: 'center',
  color: '#1d1c1d',
  width: 'max-content',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const ThreadLocation = styled.span({
  fontSize: '15px',
  fontWeight: 700,
});

const SubText = styled.span({
  display: 'block',
  fontSize: '12px',
  color: '#616061',
  margin: '5px 4px',
});

const ChannelName = styled.h1({
  fontSize: '18px',
  fontWeight: '900',
  lineHeight: '1.33',
});

const ThreadsWrapper = styled.div({
  backgroundColor: '#dddddd54',
  height: '100%',
  overflow: 'scroll',
});

const NoThreads = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const ThreadWrapper = styled.div({
  margin: '8px 16px',
});
