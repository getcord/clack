import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './app';
import { SlackRedirect } from './SlackRedirect';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const router = createBrowserRouter([
  { path: '/slackRedirect', element: <SlackRedirect /> },
  {
    path: '/',
    element: <App />,
    children: [
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
