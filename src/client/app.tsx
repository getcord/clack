import { CordProvider, ThreadedComments } from '@cord-sdk/react';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Colors } from 'src/client/Colors';
import { useCordToken } from 'src/hooks/useCordToken';
import { styled } from 'styled-components';

function App() {
  const [cordToken] = useCordToken();
  return (
    <CordProvider clientAuthToken={cordToken}>
      <Layout>
        <Topbar />
        <Sidebar />
        <Content>
          <ThreadedComments location={{ channel: '#general' }} />
        </Content>
      </Layout>
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
});

const Content = styled.div({
  gridArea: 'content',
  background: 'white',
});

const Topbar = styled.div({
  gridArea: 'topbar',
  background: Colors.purple_dark,
});
