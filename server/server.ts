import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import https from 'https';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { getClientAuthToken } from '@cord-sdk/server';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const CORD_APP_ID = process.env.CORD_APP_ID!;
export const CORD_SIGNING_SECRET = process.env.CORD_SIGNING_SECRET!;

if (!CORD_APP_ID || !CORD_SIGNING_SECRET) {
  throw new Error('Missing Cord App ID or Signing Secret from env vars');
}

const port = 3002; // browsersync currently on 3001
export const FRONT_END_HOST = 'http://localhost:3000';

function main() {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: FRONT_END_HOST }));
  app.use((req, _, next) => {
    console.log('Request:', req.method, req.originalUrl);
    return next();
  });

  type Users = {
    [cordUserID: string]: {
      name: string;
      email: string;
      profilePictureURL?: string;
      slackID?: string;
    };
  };

  const users: Users = {
    ernest: {
      name: 'Ernest',
      email: 'ernest@example.com',
      profilePictureURL: 'https://app.cord.com/static/Anon-avatar-0.png',
    },
    sylvia: {
      name: 'Sylvia',
      email: 'sylvia@example.com',
      profilePictureURL: 'https://app.cord.com/static/Anon-avatar-1.png',
    },
    oscar: {
      name: 'Oscar',
      email: 'oscar@example.com',
      profilePictureURL: 'https://app.cord.com/static/Anon-avatar-2.png',
    },
  };

  let loginAsUserIndex = 0;

  const ORG_ID = 'cord_org';
  const ORG_NAME = 'Cord Internal';

  // Supply client token for front-end Cord UI
  app.get('/token', (_, res) => {
    const userID = Object.keys(users)[loginAsUserIndex];
    loginAsUserIndex =
      loginAsUserIndex + 1 >= Object.keys(users).length
        ? 0
        : loginAsUserIndex + 1;

    const token = getClientAuthToken(CORD_APP_ID, CORD_SIGNING_SECRET, {
      user_id: userID,
      organization_id: ORG_ID,
      user_details: {
        email: users[userID].email,
        name: users[userID].name,
        profilePictureURL: users[userID].profilePictureURL,
      },
      organization_details: {
        name: ORG_NAME,
      },
    });

    res.send({ token, userID });
  });

  app.get('/channels', (_, res) => {
    res.send(['general', 'what-the-quack', 'e', 'random']);
  });

  // Catch errors and log them
  app.use(
    '/',
    (error: unknown, req: Request, res: Response, _next: NextFunction) => {
      console.log('😢 An error occurred', error);

      if (!res.headersSent) {
        res.status(500).send({
          error: 'error',
          message: 'Internal server error - check the server logs',
        });
      }
    },
  );

  // Fetch certificate to run https locally.  Run ./scripts/generate-localhost-cert.sh
  // to generate these files
  const server = https.createServer(
    {
      key: fs.readFileSync(
        path.join(__dirname, '..', 'localhost', 'localhost.key'),
      ),
      cert: fs.readFileSync(
        path.join(__dirname, '..', 'localhost', 'localhost.crt'),
      ),
    },
    app,
  );

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();
