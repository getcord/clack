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
  },
  {
    path: '/slackRedirect',
    element: <SlackRedirect />,
  },
  {
    path: '/:channelID/',
    element: <App />,
  },
]);

root.render(<RouterProvider router={router} />);
