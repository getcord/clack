import { CordProvider, ThreadedComments } from '@cord-sdk/react';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createUseStyles } from 'react-jss';
import { Colors } from 'src/client/Colors';
import { useCordToken } from 'src/hooks/useCordToken';

const useStyles = createUseStyles({
  layout: {
    display: 'grid',
    height: '100vh',
    gridTemplateAreas: `
    "topbar topbar"
    "sidebar content"`,
    gridTemplateColumns: '260px 1fr',
    gridTemplateRows: '44px 1fr',
  },
  sidebar: {
    gridArea: 'sidebar',
    background: Colors.purple,
  },
  content: {
    gridArea: 'content',
    background: 'white',
  },
  topbar: {
    gridArea: 'topbar',
    background: Colors.purple_dark,
  },
});

console.log('hello???');

function App() {
  const classes = useStyles();

  const [cordToken] = useCordToken();

  console.log({ cordToken });
  return (
    <CordProvider clientAuthToken={cordToken}>
      <div className={classes.layout}>
        <div className={classes.topbar} />
        <div className={classes.sidebar} />
        <div className={classes.content}>
          <ThreadedComments location={{ channel: '#general' }} />
        </div>
      </div>
    </CordProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
