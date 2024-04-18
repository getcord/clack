import https from 'https';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import * as dotenv from 'dotenv';
import {
  enforceLoginMiddleware,
  handleGetToken,
} from 'src/server/handlers/login';
import { handleGetChannels } from 'src/server/handlers/getChannels';
import { handleGetMyCordThreads } from 'src/server/handlers/getCordThreads';
import {
  handleGetCordUsers,
  handleGetCordUsersData,
  handleUpdateUserStatus,
} from 'src/server/handlers/getUsersInOrg';
import { AUTH_METHOD, FRONT_END_HOST } from 'src/server/consts';
import { handleRoot } from 'src/server/handlers/root';
import {
  handleAddOrgMember,
  handleRemoveOrgMember,
} from 'src/server/handlers/orgMembers';
import { handleAddChannel } from 'src/server/handlers/updateChannels';
import { handleGetSlackLogin } from 'src/server/auth/slack';
import { handleFakeLogin } from 'src/server/auth/fake';

const REPO_ROOT = path.join(__dirname, '..', '..');
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const port = 7309;

function logAndSendError(error: unknown, res: Response) {
  console.error('😢 An error occurred', error);

  if (!res.headersSent) {
    res.status(500).send({
      error: 'error',
      message: 'Internal server error - check the server logs',
    });
  }
}

function wrapAsyncHandler(
  h: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    h(req, res, next).catch((e: Error) => {
      logAndSendError(e, res);
    });
  };
}

function main() {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: FRONT_END_HOST, credentials: true }));
  app.use((req, _, next) => {
    console.log(
      new Date().toISOString(),
      'Request:',
      req.method,
      req.originalUrl,
    );
    return next();
  });

  // ----- Routes which DO NOT require login ----
  app.get('/', handleRoot);
  app.get('/token', handleGetToken);
  if (AUTH_METHOD === 'slack') {
    app.get('/slackLogin', wrapAsyncHandler(handleGetSlackLogin));
  }
  if (AUTH_METHOD === 'fake') {
    app.get('/fakeLogin', wrapAsyncHandler(handleFakeLogin));
  }

  // ----- Routes which DO require login -----
  app.use(enforceLoginMiddleware);
  app.get('/channels', wrapAsyncHandler(handleGetChannels));
  app.get('/threads', wrapAsyncHandler(handleGetMyCordThreads));
  app.put('/users/:userID', wrapAsyncHandler(handleUpdateUserStatus));
  app.get('/users', wrapAsyncHandler(handleGetCordUsers));
  app.get('/usersData', wrapAsyncHandler(handleGetCordUsersData));

  app.put('/channelMembers/:channelName', wrapAsyncHandler(handleAddOrgMember));
  app.delete(
    '/channelMembers/:channelName',
    wrapAsyncHandler(handleRemoveOrgMember),
  );

  app.put('/channels/:channelName', wrapAsyncHandler(handleAddChannel));

  // Catch errors and log them
  app.use(
    '/',
    (error: unknown, req: Request, res: Response, _next: NextFunction) => {
      logAndSendError(error, res);
    },
  );

  // Fetch certificate to run https locally.  Run ./scripts/generate-localhost-cert.sh
  // to generate these files
  const server =
    process.env.CLACK_ENV === 'development'
      ? https.createServer(
          {
            key: fs.readFileSync(
              path.join(REPO_ROOT, 'localhost', 'localhost.key'),
            ),
            cert: fs.readFileSync(
              path.join(REPO_ROOT, 'localhost', 'localhost.crt'),
            ),
          },
          app,
        )
      : http.createServer(app);

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();
