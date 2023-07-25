import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import https from 'https';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { handleGetToken } from './handlers/getToken';
import { handleGetChannels } from './handlers/getChannels';

const REPO_ROOT = path.join(__dirname, '..', '..');
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

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

  app.get('/token', handleGetToken);
  app.get('/channels', handleGetChannels);

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
      key: fs.readFileSync(path.join(REPO_ROOT, 'localhost', 'localhost.key')),
      cert: fs.readFileSync(path.join(REPO_ROOT, 'localhost', 'localhost.crt')),
    },
    app,
  );

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();
