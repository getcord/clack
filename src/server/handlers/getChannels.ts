import type { ServerGetUser, ServerUserData } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { EVERYONE_ORG_ID, isDirectMessageChannel } from 'src/common/consts';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

export async function handleGetChannels(req: Request, res: Response) {
  const { user_id } = (req as any).loginTokenData;

  const { groups } = await fetchCordRESTApi<ServerGetUser>(`users/${user_id}`);

  let mostChannels: Record<string, string>;
  try {
    mostChannels = (
      await fetchCordRESTApi<ServerUserData>('users/all_channels_holder')
    ).metadata as Record<string, string>;
  } catch (e: any) {
    if (e instanceof Error && e.message.includes('user_not_found')) {
      // Create the holder user
      await fetchCordRESTApi('users/all_channels_holder', 'PUT');
      mostChannels = {};
    } else {
      throw e;
    }
  }

  const availableChannels = Object.entries(mostChannels)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reduce(
      (acc, [key, value]) => {
        if (groups.includes(value)) {
          acc[key] = value;
        }
        return acc;
      },
      // Special channel: everyone starts with general in their list
      { general: EVERYONE_ORG_ID } as Record<string, string | null>,
    );

  // Special channels: everyone gets these testing channels at the end of their list
  availableChannels['noise'] = EVERYONE_ORG_ID;
  availableChannels['what-the-quack'] = EVERYONE_ORG_ID;

  groups
    .map((g) => g.toString())
    .filter(isDirectMessageChannel)
    .forEach((group) => {
      availableChannels[group] = group;
    });

  res.send(availableChannels);
}
