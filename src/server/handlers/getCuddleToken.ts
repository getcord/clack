import { AccessToken, EgressClient, EncodedFileType } from 'livekit-server-sdk';
import { nanoid } from 'nanoid';
import {
  type ServerUpdateMessage,
  type CoreThreadData,
  type ServerUpdateUser,
} from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import { ORG_ID } from 'src/server/consts';

const serverUrl = 'https://cuddle-test-yjaxne2q.livekit.cloud';
export async function handleGetCuddleToken(req: Request, res: Response) {
  const { channel, userID } = req.body;
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
  at.addGrant({ roomJoin: true, room: channel });

  // check if live cuddle thread exists for the channel
  const allThreads = await fetchCordRESTApi<CoreThreadData[]>(
    `threads?filter=${JSON.stringify({
      location: { channel },
      metadata: { cuddle: true, live: true },
    })}`,
    'GET',
  );

  if (allThreads.length === 0) {
    // create a new thread for cuddle
    const newThreadBody = JSON.stringify({
      id: `cuddle-${nanoid(16)}`,
      authorID: 'ernest',
      content: [
        { type: 'p', children: [{ text: `${user.name} wants a cuddle.` }] },
      ],
      createThread: {
        name: 'Cuddle',
        metadata: { cuddle: true, live: true },
        url: `https://clack.cord.com/channel/${channel}`,
        location: { channel },
        organizationID: ORG_ID,
        extraClassnames: 'cuddle',
      },
    });
    await fetchCordRESTApi<ServerUpdateMessage>(
      `threads/${channel}${nanoid(16)}/messages`,
      'POST',
      newThreadBody,
    ).catch((e) => console.log('failed to create cuddle thread', e.message));
  }
  // const client = new EgressClient(
  //   serverUrl,
  //   process.env.LK_API_KEY,
  //   process.env.LK_API_SECRET,
  // );
  // const egressInfo = await client.startRoomCompositeEgress(
  //   channel,
  //   {
  //     filepath: `${channel}5.mp4`,
  //     fileType: EncodedFileType.MP4,
  //     s3: {
  //       accessKey: process.env.S3_ACCESS_KEY,
  //       secret: process.env.S3_SECRET_KEY,
  //       region: process.env.S3_REGION,
  //       bucket: process.env.S3_BUCKET,
  //     },
  //   },
  //   { layout: 'speaker' },
  // );
  // console.log(egressInfo);

  // setTimeout(() => {
  //   void client.stopEgress(egressInfo.egressId!);
  //   console.log('stopped recording', egressInfo);
  // }, 30000);

  res.json({ token: at.toJwt() });
}
