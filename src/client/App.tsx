import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import type { NavigateFn } from '@cord-sdk/types';
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

  const navigate = useNavigate();
  const location = useLocation();
  const openPanel = location.pathname.split('/')[1];
  const channelID = openPanel === 'channel' ? channelIDParam || 'general' : '';

  const onOpenThread = (threadID: string) => {
    navigate(`/channel/${channelID}/thread/${threadID}`);
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

  const translations = useMemo(
    () => ({
      en: { composer: { add_a_comment: `Message #${channelID}` } },
    }),
    [channelID],
  );

  return (
    <>
      <GlobalStyle />
      <Helmet>
        <title>#{channelID} - Clack</title>
      </Helmet>
      <CordProvider
        clientAuthToken={cordToken}
        cordScriptUrl="https://app.staging.cord.com/sdk/v1/sdk.latest.js"
        enableSlack={false}
        enableTasks={false}
        enableAnnotations={false}
        navigate={onCordNavigate}
        translations={translations}
      >
        <UsersProvider>
          <BrowserNotificationBridge />
          <PresenceObserver location={{ page: 'clack', durable: true }}>
            <Layout className={threadID ? 'openThread' : ''}>
              <Topbar userID={cordUserID} />
              <Sidebar channelID={channelID} openPanel={openPanel} />
              <MessageProvider>
                <Content>
                  {openPanel === 'channel' && (
                    <Chat
                      key={channelID}
                      channel={channelID}
                      onOpenThread={onOpenThread}
                    />
                  )}

                  {openPanel === 'threads' && (
                    <ThreadsList cordUserID={cordUserID} />
                  )}
                </Content>
                {threadID && (
                  <ThreadDetails
                    channelID={channelID}
                    threadID={threadID}
                    onClose={() => navigate(`/channel/${channelID}`)}
                  />
                )}
              </MessageProvider>
            </Layout>
          </PresenceObserver>
        </UsersProvider>
      </CordProvider>
    </>
  );
}

const Layout = styled.div({
  display: 'grid',
  height: '100vh',
  maxHeight: '100vh',
  gridTemplateAreas: `
    "topbar topbar"
    "sidebar content"`,
  gridTemplateColumns: '260px 1fr',
  gridTemplateRows: '44px 1fr',

  '&.openThread': {
    gridTemplateAreas: `
      "topbar topbar topbar"
      "sidebar content thread"`,
    gridTemplateColumns: '260px 2fr 1fr',
  },
});

const Sidebar = styled(DefaultSidebar)`
  grid-area: sidebar;
`;

const Content = styled.div({
  gridArea: 'content',
  background: 'white',
  overflow: 'hidden',
});

const Topbar = styled(TopbarDefault)({
  gridArea: 'topbar',
  background: Colors.purple_dark,
  color: 'white',
});

const ThreadDetails = styled(ThreadDetailsDefault)`
  grid-area: thread;
`;
