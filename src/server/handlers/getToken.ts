import type { Request, Response } from 'express';
import { getClientAuthToken } from '@cord-sdk/server';

export const CORD_APP_ID = process.env.CORD_APP_ID!;
export const CORD_SIGNING_SECRET = process.env.CORD_SIGNING_SECRET!;

if (!CORD_APP_ID || !CORD_SIGNING_SECRET) {
  throw new Error('Missing Cord App ID or Signing Secret from env vars');
}

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

export function handleGetToken(_: Request, res: Response) {
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
}
