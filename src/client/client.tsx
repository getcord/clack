import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { App } from 'src/client/App';
import { FakeLogin } from 'src/client/components/FakeLogin';
import { SlackRedirect } from 'src/client/components/SlackRedirect';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const router = createBrowserRouter([
  { path: '/slackRedirect', element: <SlackRedirect /> },
  { path: '/fakeLogin', element: <FakeLogin /> },
  {
    path: '/',
    element: <Navigate to="channel/general/" replace />,
  },
  {
    path: '/channel/:channelID/',
    element: <App />,
    children: [
      {
        path: 'thread/:threadID/',
        element: <App />,
      },
    ],
  },
  {
    path: '/threads/',
    element: <App />,
  },
]);

root.render(<RouterProvider router={router} />);
