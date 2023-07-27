import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './app';
import { SlackRedirect } from './SlackRedirect';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/slackRedirect',
        element: <SlackRedirect />,
      },
      {
        path: '/:channelID/thread/:threadID/',
        element: <App />,
      },
      {
        path: '/:channelID/',
        element: <App />,
      },
    ],
  },
]);

root.render(<RouterProvider router={router} />);
