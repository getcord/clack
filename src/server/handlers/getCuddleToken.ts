import { AccessToken } from 'livekit-server-sdk';
import type { ServerUpdateUser } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleGetCuddleToken(req: Request, res: Response) {
  const { roomName, userID } = req.body;
  const user = await fetchCordRESTApi<ServerUpdateUser>(
    `users/${userID}`,
    'GET',
  );
  const at = new AccessToken(
    process.env.LK_API_KEY,
    process.env.LK_API_SECRET,
    {
      identity: userID,
      name: user.name ?? 'Guest',
    },
  );
  at.addGrant({ roomJoin: true, room: roomName });

  res.json({ token: at.toJwt() });
}
