import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { App } from './app';
import { SlackRedirect } from './SlackRedirect';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const router = createBrowserRouter([
  { path: '/slackRedirect', element: <SlackRedirect /> },
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
