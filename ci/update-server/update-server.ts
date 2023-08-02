import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import http from 'http';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import path from 'path';
import child_process from 'child_process';

const port = 7321;

const CLACK_REPO_ROOT = path.join(__dirname, '..', '..');

dotenv.config({ path: path.join(CLACK_REPO_ROOT, '.env') });

function logAndSendError(error: unknown, res: Response) {
  console.error('😢 An error occurred', error);

  if (!res.headersSent) {
    res.status(500).send({
      error: 'error',
      message: 'Internal server error - check the server logs',
    });
  }
}

function main() {
  const app = express();

  app.use((req, _, next) => {
    console.log('Request:', req.method, req.originalUrl);
    return next();
  });

  app.get('/secret/update', (req, res) => {
    if (!process.env.UPDATE_SECRET) {
      res.status(500).send();
      throw new Error('Missing secret! Is .env set up?');
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.indexOf('Bearer') !== 0) {
      res.status(403).send('Forbidden');
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (token !== process.env.UPDATE_SECRET) {
      res.status(403).send('Forbidden');
      return;
    }

    const proc = child_process.spawn('./scripts/update.sh');

    proc.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`Completed update`);
        res.send('ok!');
      } else {
        console.log(`Error when updating - non 0 exit code`);
        res.status(500).send('Server error - check logs');
      }
    });

    proc.on('error', (err) => {
      console.log(`Error when updating`);
      console.error(err);
      res.status(500).send('Server error - check logs');
    });
  });

  // Catch errors and log them
  app.use(
    '/',
    (error: unknown, req: Request, res: Response, _next: NextFunction) => {
      logAndSendError(error, res);
    },
  );

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Update server listening on port ${port}`);
  });
}

main();
