import { CordProvider, ThreadedComments } from '@cord-sdk/react';
import * as React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <CordProvider clientAuthToken="eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIwZWZjMDJjMC1lYzg2LTQ1MDgtOTNiYi02ZDU0NjBlZDkxNTAiLCJ1c2VyX2lkIjoiNzZhMzM2YjEtMmViNS00Y2MwLTg4MzEtZDAzNzBmYWE5ZWZiIiwib3JnYW5pemF0aW9uX2lkIjoiMGI5ZDk3OWYtYzQ3ZS00NWNkLWFjYjQtMTQyYWIyYTRlNjk3IiwidXNlcl9kZXRhaWxzIjp7Im5hbWUiOiJTYW1wbGUgVXNlciIsImVtYWlsIjoic2FtcGxlLXVzZXJANjk5NjY5NjkxLmNvcmQuY29tIiwicHJvZmlsZV9waWN0dXJlX3VybCI6Imh0dHBzOi8vYXBwLmNvcmQuY29tL3N0YXRpYy9Bbm9uLWF2YXRhci1BLnBuZyJ9LCJvcmdhbml6YXRpb25fZGV0YWlscyI6eyJuYW1lIjoiU2FtcGxlIE9yZyJ9LCJpYXQiOjE2OTAyODEwNjIsImV4cCI6MTY5MDg4NTg2Mn0.1QzNVY7KvK9_66oFt8xO_Zk910ujWTnd7a9ttOMnD5L8-RcgGx809CfrsSNnsT_365zWd5Wna9dRXZ-vCgIvlg">
      <div>
        <h1>Hello, ESBUILD ELENA!</h1>
        <Panel />
        <Panel />
        <ThreadedComments location={{ channel: '#general' }} />
      </div>
    </CordProvider>
  );
}

const Panel = () => <h2>I'm a Panel</h2>;

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
