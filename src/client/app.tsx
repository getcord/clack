import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Colors } from 'src/client/Colors';
import { styled } from 'styled-components';
import { Channels } from './channels';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from './topbar';
import { API_HOST } from './consts';

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

import { Chat } from './Chat';
import { requestNotificationPermission } from 'src/client/notifications';

function App() {
  const [cordToken, cordUserID] = useCordToken();
  const [currentChannel, setCurrentChannel] = React.useState('general');

  React.useEffect(() => {
    void requestNotificationPermission();
  }, []);

  return (
    <CordProvider clientAuthToken={cordToken}>
      <PresenceObserver>
        <Layout>
          <Topbar userID={cordUserID} />
          <Sidebar>
            <SidebarHeader>Clack</SidebarHeader>
            <Channels
              setCurrentChannel={setCurrentChannel}
              currentChannel={currentChannel}
            />
          </Sidebar>
          <Content>
            <Chat channel={currentChannel} />
          </Content>
        </Layout>
      </PresenceObserver>
    </CordProvider>
  );
}

if (window.location.pathname === '/slackRedirect') {
  const incomingUrlParams = new URLSearchParams(window.location.search);
  const outgoingUrlParams = new URLSearchParams({
    code: incomingUrlParams.get('code') ?? '',
    state: incomingUrlParams.get('state') ?? '',
  });

  fetch(`${API_HOST}/slackLogin?${outgoingUrlParams.toString()}`, {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => (window.location.href = data.redirect))
    .catch((error) => console.error('slackRedirect error', error));
} else {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<App />);
}

const Layout = styled.div({
  display: 'grid',
  height: '100vh',
  gridTemplateAreas: `
    "topbar topbar"
    "sidebar content"`,
  gridTemplateColumns: '260px 1fr',
  gridTemplateRows: '44px 1fr',
});

const Sidebar = styled.div({
  gridArea: 'sidebar',
  background: Colors.purple,
  padding: '0 8px',
});

const SidebarHeader = styled.div({
  display: 'flex',
  borderBottom: `1px solid ${Colors.purple_border}`,
  color: 'white',
  position: 'sticky',
  minHeight: '50px',
  alignItems: 'center',
});

const Content = styled.div({
  gridArea: 'content',
  background: 'white',
});

const Topbar = styled(TopbarDefault)({
  gridArea: 'topbar',
  background: Colors.purple_dark,
  color: 'white',
});
