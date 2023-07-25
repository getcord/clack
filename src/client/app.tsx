import { CordProvider, ThreadedComments } from '@cord-sdk/react';
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createUseStyles } from 'react-jss';
import { Colors } from 'src/client/Colors';

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

function App() {
  const classes = useStyles();
  return (
    <CordProvider clientAuthToken="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIwZWZjMDJjMC1lYzg2LTQ1MDgtOTNiYi02ZDU0NjBlZDkxNTAiLCJ1c2VyX2lkIjoiNzZhMzM2YjEtMmViNS00Y2MwLTg4MzEtZDAzNzBmYWE5ZWZiIiwib3JnYW5pemF0aW9uX2lkIjoiMGI5ZDk3OWYtYzQ3ZS00NWNkLWFjYjQtMTQyYWIyYTRlNjk3IiwidXNlcl9kZXRhaWxzIjp7Im5hbWUiOiJTYW1wbGUgVXNlciIsImVtYWlsIjoic2FtcGxlLXVzZXJANjk5NjY5NjkxLmNvcmQuY29tIiwicHJvZmlsZV9waWN0dXJlX3VybCI6Imh0dHBzOi8vYXBwLmNvcmQuY29tL3N0YXRpYy9Bbm9uLWF2YXRhci1BLnBuZyJ9LCJvcmdhbml6YXRpb25fZGV0YWlscyI6eyJuYW1lIjoiU2FtcGxlIE9yZyJ9LCJpYXQiOjE2OTAyODEwNjIsImV4cCI6MTY5MDg4NTg2Mn0.1QzNVY7KvK9_66oFt8xO_Zk910ujWTnd7a9ttOMnD5L8-RcgGx809CfrsSNnsT_365zWd5Wna9dRXZ-vCgIvlg">
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
