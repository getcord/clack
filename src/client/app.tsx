import {
  CordProvider,
  ThreadedComments,
  PresenceObserver,
} from '@cord-sdk/react';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Colors } from 'src/client/Colors';
import { styled } from 'styled-components';
import { Channels } from './channels';
import { useAPIFetch } from 'src/client/hooks/useAPIFetch';
import { Topbar as TopbarDefault } from './topbar';

function useCordToken(): [string | undefined, string | undefined] {
  const data = useAPIFetch<{ userID: string; token: string }>('/token');
  return [data?.token, data?.userID];
}

function App() {
  const [cordToken, cordUserID] = useCordToken();
  const [currentChannel, setCurrentChannel] = React.useState('general');

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
            <ThreadedComments location={{ channel: currentChannel }} />
          </Content>
        </Layout>
      </PresenceObserver>
    </CordProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

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
});
