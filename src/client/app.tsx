import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Colors } from 'src/client/Colors';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from 'src/client/topbar';
import { Chat } from 'src/client/Chat';
import { ThreadDetails as ThreadDetailsDefault } from 'src/client/ThreadDetails';
import { Sidebar as DefaultSidebar } from 'src/client/Sidebar';
import { BrowserNotificationBridge } from 'src/client/BrowserNotificationBridge';
import { ThreadsList } from 'src/client/ThreadsList';

function useCordToken(): [string | undefined, string | undefined] {
  const data = useAPIFetch<
    { userID: string; token: string } | { redirect: string }
  >('/token');

  if (!data) {
    return [undefined, undefined];
  } else if ('redirect' in data) {
    window.location.href = data.redirect;
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

  const translations = useMemo(
    () => ({
      en: { composer: { add_a_comment: `Message #${channelID}` } },
    }),
    [channelID],
  );

  return (
    <>
      <Helmet>
        <title>#{channelID} - Clack</title>
      </Helmet>
      <CordProvider
        clientAuthToken={cordToken}
        cordScriptUrl="https://app.staging.cord.com/sdk/v1/sdk.latest.js"
        enableSlack={false}
        enableTasks={false}
        enableAnnotations={false}
        translations={translations}
      >
        <BrowserNotificationBridge />
        <PresenceObserver location={{ page: 'clack', durable: true }}>
          <Layout className={threadID ? 'openThread' : ''}>
            <Topbar userID={cordUserID} />
            <Sidebar channelID={channelID} openPanel={openPanel} />
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
          </Layout>
        </PresenceObserver>
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
  zIndex: 2,
});

const Topbar = styled(TopbarDefault)({
  gridArea: 'topbar',
  background: Colors.purple_dark,
  color: 'white',
});

const ThreadDetails = styled(ThreadDetailsDefault)`
  grid-area: thread;
  z-index: 1;
`;
