import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { Colors } from 'src/client/Colors';
import { styled } from 'styled-components';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from './topbar';
import { useParams } from 'react-router-dom';
import { Chat } from './Chat';
import { ThreadDetails as ThreadDetailsDefault } from 'src/client/ThreadDetails';
import { Sidebar as DefaultSidebar } from 'src/client/Sidebar';
import { BrowserNotificationBridge } from './BrowserNotificationBridge';
import { ThreadsList } from 'src/client/ThreadsList';
import { Helmet } from 'react-helmet';

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
  const [openThreadID, setOpenThreadID] = React.useState<string | null>(null);
  const [openPanel, setOpenPanel] = React.useState<string | null>(null);

  const { channelID: channelIDParam } = useParams();
  const channelID = !openPanel ? channelIDParam || 'general' : '';

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
      >
        <BrowserNotificationBridge />
        <PresenceObserver>
          <Layout className={openThreadID ? 'openThread' : ''}>
            <Topbar userID={cordUserID} />
            <Sidebar
              channelID={channelID}
              setOpenPanel={setOpenPanel}
              openPanel={openPanel}
            />
            <Content>
              {!openPanel && (
                <Chat
                  key={channelID}
                  channel={channelID}
                  onOpenThread={setOpenThreadID}
                />
              )}

              {openPanel === 'threads' && (
                <ThreadsList cordUserID={cordUserID} />
              )}
            </Content>
            {openThreadID !== null && (
              <ThreadDetails
                threadID={openThreadID}
                onClose={() => setOpenThreadID(null)}
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
});

const Topbar = styled(TopbarDefault)({
  gridArea: 'topbar',
  background: Colors.purple_dark,
  color: 'white',
});

const ThreadDetails = styled(ThreadDetailsDefault)`
  grid-area: thread;
`;
