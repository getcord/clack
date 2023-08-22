import { AccessToken } from 'livekit-server-sdk';
import type { CoreThreadData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import { ORG_ID } from 'src/server/consts';

export async function handleGetCuddleToken(req: Request, res: Response) {
  const roomName = 'quickstart-room';
  const participantName = 'quickstart-username';

  const at = new AccessToken(
    process.env.LK_API_KEY,
    process.env.LK_API_SECRET,
    {
      identity: 'myhoa',
    },
  );
  at.addGrant({ roomJoin: true, room: roomName });
  console.log({ token: at.toJwt() });
  res.send(at.toJwt());
}
