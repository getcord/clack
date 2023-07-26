import { CordProvider, PresenceObserver } from '@cord-sdk/react';
import * as React from 'react';
import { Colors } from 'src/client/Colors';
import { styled } from 'styled-components';
import { Channels } from './channels';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from './topbar';
import { useParams, useNavigate } from 'react-router-dom';
import { Chat } from './Chat';
import { requestNotificationPermission } from 'src/client/notifications';

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

  const { channelID } = useParams();
  const navigate = useNavigate();

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
              setCurrentChannel={(channel) => navigate(`/${channel}`)}
              currentChannel={channelID || 'general'}
            />
          </Sidebar>
          <Content>
            <Chat channel={channelID || 'general'} />
          </Content>
        </Layout>
      </PresenceObserver>
    </CordProvider>
  );
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
});

const SidebarHeader = styled.div({
  display: 'flex',
  borderBottom: `1px solid ${Colors.purple_border}`,
  borderTop: `1px solid ${Colors.purple_border}`,
  color: 'white',
  position: 'sticky',
  minHeight: '50px',
  alignItems: 'center',
  padding: '0 16px',
  fontSize: '18px',
  fontWeight: 700,
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
