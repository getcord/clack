import type { ServerGetUser, ServerUserData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleGetChannels(req: Request, res: Response) {
  const { user_id } = (req as any).loginTokenData;

  const { organizations } = await fetchCordRESTApi<ServerGetUser>(
    `users/${user_id}`,
  );

  const mostChannels = (
    await fetchCordRESTApi<ServerUserData>('users/all_channels_holder')
  ).metadata as Record<string, string>;

  const availableChannels = Object.entries(mostChannels)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reduce(
      (acc, [key, value]) => {
        if (value === '' || organizations.includes(value)) {
          acc[key] = value;
        }
        return acc;
      },
      // Special channel: everyone starts with general in their list
      { general: '' } as Record<string, string | null>,
    );

  // Special channels: everyone gets these testing channels at the end of their list
  availableChannels['noise'] = '';
  availableChannels['what-the-quack'] = '';

  res.send(availableChannels);
}
