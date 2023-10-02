import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import type { NavigateFn } from '@cord-sdk/types';
import cx from 'classnames';

import type { Channel } from 'src/client/consts/Channel';
import { Colors } from 'src/client/consts/Colors';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from 'src/client/components/Topbar';
import { Chat } from 'src/client/components/Chat';
import { ThreadDetails as ThreadDetailsDefault } from 'src/client/components/ThreadDetails';
import { Sidebar as DefaultSidebar } from 'src/client/components/Sidebar';
import { BrowserNotificationBridge } from 'src/client/components/BrowserNotificationBridge';
import { ThreadsList } from 'src/client/components/ThreadsList';
import { GlobalStyle } from 'src/client/components/style/GlobalStyle';
import { MessageProvider } from 'src/client/context/MessageContext';
import { UsersProvider } from 'src/client/context/UsersProvider';
import { BREAKPOINTS_PX, EVERYONE_ORG_ID } from 'src/client/consts/consts';

function useCordToken(): [string | undefined, string | undefined] {
  const data = useAPIFetch<
    { userID: string; token: string } | { redirect: string }
  >('/token');

  if (!data) {
    return [undefined, undefined];
  } else if ('redirect' in data) {
    const redirectUrl = new URL(data.redirect);
    redirectUrl.searchParams.set('state', window.location.href);
    window.location.href = redirectUrl.toString();
    return [undefined, undefined];
  } else {
    return [data.token, data.userID];
  }
}

export function App() {
  const [cordToken, cordUserID] = useCordToken();
  const { channelID: channelIDParam, threadID } = useParams();
  // We only hide the sidebar on mobile, to regain some space.
  const [showSidebar, setShowSidebar] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const openPanel = location.pathname.split('/')[1];

  const allChannelsToOrg =
    useAPIFetch<Record<string, string>>('/channels') ?? {};

  const allChannelsArray = Object.entries(allChannelsToOrg).reduce(
    (acc, [key, value]) => {
      acc.push({ id: key, org: value });
      return acc;
    },
    [] as Channel[],
  );

  const channelID = channelIDParam ?? 'general';
  const channel: Channel =
    openPanel === 'channel'
      ? { id: channelID, org: allChannelsToOrg[channelID] }
      : { id: '', org: EVERYONE_ORG_ID };

  const onOpenThread = (threadID: string) => {
    navigate(`/channel/${channel.id}/thread/${threadID}`);
  };

  // TODO: This should happen onNotificationClick.
  // Remove this code once that's available.
  React.useEffect(() => {
    if (threadID) {
      // If there's a thread open, hide the sidebar.
      setShowSidebar(false);
    }
  }, [threadID]);

  const onCordNavigate: NavigateFn = React.useCallback(
    (_url, location, { threadID }) => {
      if (!(location && 'channel' in location)) {
        return false;
      }

      navigate(`/channel/${location.channel}/thread/${threadID}`);
      return true;
    },
    [navigate],
  );

  const translations = useMemo(
    () => ({
      en: {
        composer: {
          // TODO(flooey): Remove add_a_comment once we upgrade the NPM package
          add_a_comment: `Message #${channel.id}`,
          send_message_placeholder: `Message #${channel.id}`,
        },
      },
    }),
    [channel.id],
  );

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>#{channel.id} - Clack</title>
      </Helmet>
      <CordProvider
        clientAuthToken={cordToken}
        cordScriptUrl="https://app.staging.cord.com/sdk/v1/sdk.latest.js"
        enableSlack={false}
        enableTasks={false}
        enableAnnotations={false}
        navigate={onCordNavigate}
        // @ts-ignore
        translations={translations}
      >
        <UsersProvider>
          <BrowserNotificationBridge />
          <PresenceObserver
            location={{ page: 'clack', durable: true }}
            style={{ height: '100%' }}
          >
            <ResponsiveLayout
              className={cx({ openThread: threadID, openSidebar: showSidebar })}
            >
              <Topbar userID={cordUserID} setShowSidebar={setShowSidebar} />
              <Sidebar
                channel={channel}
                allChannels={allChannelsArray}
                openPanel={openPanel}
                setShowSidebar={setShowSidebar}
              />
              <MessageProvider>
                <ResponsiveContent>
                  {openPanel === 'channel' && (
                    <Chat
                      key={channel.id}
                      channel={channel}
                      onOpenThread={onOpenThread}
                    />
                  )}

                  {openPanel === 'threads' && (
                    <ThreadsList cordUserID={cordUserID} />
                  )}
                </ResponsiveContent>
                {threadID && (
                  <ThreadDetails
                    channel={channel}
                    threadID={threadID}
                    onClose={() => navigate(`/channel/${channel.id}`)}
                  />
                )}
              </MessageProvider>
            </ResponsiveLayout>
          </PresenceObserver>
        </UsersProvider>
      </CordProvider>
    </>
  );
}

// @media queries are NOT supported with the below div({}) Syntax
// hence why ResponsiveLayout is a separate component.
const Layout = styled.div({
  display: 'grid',
  height: '100%',
  maxHeight: '100vh',
  gridTemplateAreas: `
    "topbar topbar"
    "sidebar content"`,
  gridTemplateColumns: '260px 1fr',
  gridTemplateRows: '44px 1fr',

  '&:where(.openThread)': {
    gridTemplateAreas: `
      "topbar topbar topbar"
      "sidebar content thread"`,
    gridTemplateColumns: '260px 2fr 1fr',
  },
});
const ResponsiveLayout = styled(Layout)`
  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    &.openThread:not(.openSidebar) {
      grid-template-areas:
        'topbar'
        'thread';
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    &:not(.openSidebar) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'topbar'
        'content';
    }

    &.openSidebar {
      grid-template-areas:
        'topbar'
        'sidebar';
      grid-template-columns: 1fr;
    }
  }
`;

const Sidebar = styled(DefaultSidebar)`
  grid-area: sidebar;

  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    .openThread & {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    display: none;

    .openSidebar & {
      display: grid;
    }
  }
`;

// Can't add @media query to div({}) syntax, hence why
// separate ResponsiveContent below.
const Content = styled.div({
  gridArea: 'content',
  background: 'white',
  overflow: 'hidden',
});
const ResponsiveContent = styled(Content)`
  @media (max-width: ${BREAKPOINTS_PX.FULLSCREEN_THREADS}px) {
    .openThread & {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINTS_PX.COLLAPSE_SIDEBAR}px) {
    .openSidebar & {
      display: none;
    }
  }
`;

const Topbar = styled(TopbarDefault)({
  gridArea: 'topbar',
  background: Colors.purple_dark,
  color: 'white',
  position: 'sticky',
  top: 0,
});

const ThreadDetails = styled(ThreadDetailsDefault)`
  grid-area: thread;
`;
