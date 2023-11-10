import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import type { NavigateFn } from '@cord-sdk/types';
import cx from 'classnames';

import type { Channel } from 'src/client/context/ChannelsContext';
import { Colors } from 'src/client/consts/Colors';
import { useAPIFetch, useLazyAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from 'src/client/components/Topbar';
import { Chat } from 'src/client/components/Chat';
import { ThreadDetails as ThreadDetailsDefault } from 'src/client/components/ThreadDetails';
import { Sidebar as DefaultSidebar } from 'src/client/components/Sidebar';
import { BrowserNotificationBridge } from 'src/client/components/BrowserNotificationBridge';
import { GlobalStyle } from 'src/client/components/style/GlobalStyle';
import { MessageProvider } from 'src/client/context/MessageContext';
import { UsersProvider } from 'src/client/context/UsersProvider';
import { BREAKPOINTS_PX, EVERYONE_ORG_ID } from 'src/client/consts/consts';
import { ChannelsContext } from 'src/client/context/ChannelsContext';
import { LANGS, getTranslations, type Language } from 'src/client/l10n';
import { useStateWithLocalStoragePersistence } from 'src/client/utils';

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
  const [allChannelsObj, setAllChannelsObj] = React.useState<
    Record<string, string>
  >({});
  const [allChannelsArray, setAllChannelsArray] = React.useState<Channel[]>([]);
  const [lang, setLang] = useStateWithLocalStoragePersistence<Language>(
    'clack-language',
    'en',
  );

  const navigate = useNavigate();
  const location = useLocation();
  const openPanel = location.pathname.split('/')[1];

  const fetch = useLazyAPIFetch();

  const fetchChannels = React.useCallback(
    () =>
      void fetch('/channels', 'GET')
        .then((allChannelsToOrg: { string: string }) => {
          if (allChannelsToOrg) {
            setAllChannelsObj(allChannelsToOrg);
            const allChannelsArray = Object.entries(allChannelsToOrg).reduce(
              (acc, [key, value]) => {
                acc.push({ id: key, org: value });
                return acc;
              },
              [] as Channel[],
            );
            setAllChannelsArray(allChannelsArray);
          }
        })
        .catch((e) => console.error(e)),
    [fetch],
  );

  React.useEffect(() => {
    fetchChannels();
    // Refetch channels every 5 mins in case someone else added one
    const int = setInterval(
      () => {
        void fetchChannels();
      },
      1000 * 60 * 5,
    );

    return () => clearInterval(int);
  }, [fetchChannels]);

  const channelID = channelIDParam ?? 'general';
  const channel: Channel =
    openPanel === 'channel'
      ? { id: channelID, org: allChannelsObj[channelID] }
      : { id: '', org: EVERYONE_ORG_ID };

  const onOpenThread = (threadID: string) => {
    navigate(`/channel/${channel.id}/thread/${threadID}`);
  };

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

  const translations = useMemo(() => getTranslations(channel.id), [channel.id]);

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>
          #{channel.id} - {LANGS.find((l) => l.lang === lang)?.name}
        </title>
      </Helmet>
      <CordProvider
        clientAuthToken={cordToken}
        cordScriptUrl="https://app.staging.cord.com/sdk/v1/sdk.latest.js"
        enableSlack={false}
        enableTasks={false}
        enableAnnotations={false}
        navigate={onCordNavigate}
        language={lang}
        translations={translations}
      >
        <UsersProvider>
          <ChannelsContext.Provider
            value={{
              channels: allChannelsArray,
              refetch: fetchChannels,
            }}
          >
            <BrowserNotificationBridge />
            <PresenceObserver
              location={{ page: 'clack', durable: true }}
              style={{ height: '100%' }}
              groupId={EVERYONE_ORG_ID}
            >
              <ResponsiveLayout
                className={cx({
                  openThread: threadID,
                  openSidebar: showSidebar,
                })}
              >
                <Topbar userID={cordUserID} setShowSidebar={setShowSidebar} />
                <Sidebar
                  channel={channel}
                  setShowSidebar={setShowSidebar}
                  lang={lang}
                  setLang={setLang}
                />
                <MessageProvider>
                  <ResponsiveContent>
                    {openPanel === 'channel' && channel.org && (
                      <Chat
                        key={channel.id}
                        channel={channel}
                        onOpenThread={onOpenThread}
                      />
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
          </ChannelsContext.Provider>
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
