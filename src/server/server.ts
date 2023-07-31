import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import https from 'https';
import http from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import {
  enforceLoginMiddleware,
  handleGetSlackLogin,
  handleGetToken,
} from './handlers/login';
import { handleGetChannels } from './handlers/getChannels';
import { handleGetMyCordThreads } from 'src/server/handlers/getCordThreads';
import { handleGetCordUsers } from 'src/server/handlers/getUsersInOrg';
import { FRONT_END_HOST } from 'src/server/consts';
import { handleRoot } from 'src/server/handlers/root';

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
    console.log('Request:', req.method, req.originalUrl);
    return next();
  });

  // ----- Routes which DO NOT require login ----
  app.get('/', handleRoot);
  app.get('/token', handleGetToken);
  app.get('/slackLogin', wrapAsyncHandler(handleGetSlackLogin));

  // ----- Routes which DO require login -----
  app.use(enforceLoginMiddleware);
  app.get('/channels', wrapAsyncHandler(handleGetChannels));
  app.get('/threads', wrapAsyncHandler(handleGetMyCordThreads));
  app.get('/users', wrapAsyncHandler(handleGetCordUsers));

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
