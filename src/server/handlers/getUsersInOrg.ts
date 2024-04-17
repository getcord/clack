import type {
  ServerGroupData,
  ServerUpdateUser,
  ServerUserData,
} from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';
import { EVERYONE_ORG_ID } from 'src/server/consts';

export async function handleGetCordUsers(_: Request, res: Response) {
  const org = await fetchCordRESTApi<ServerGroupData>(
    `groups/${EVERYONE_ORG_ID}`,
  );
  res.send(org.members);
}

export async function handleGetCordUsersData(_: Request, res: Response) {
  const org = await fetchCordRESTApi<ServerGroupData>(
    `groups/${EVERYONE_ORG_ID}`,
  );

  const users = org.members;

  if (!users) {
    res.send([]);
    return;
  }

  const userData: ServerUserData[] = await Promise.all(
    users.map((id) => fetchCordRESTApi<ServerUserData>(`users/${id}`)),
  );

  res.send(userData);
}

export async function handleUpdateUserStatus(req: Request, res: Response) {
  const { user_id } = (req as any).loginTokenData;
  if (user_id !== req.params.userID) {
    res.status(401).send('Cannot set status for another user');
    return;
  }

  const keys = Object.keys(req.body);
  if (keys.length !== 1 || keys[0] !== 'metadata') {
    res.status(403).send('Can only set metadata');
    return;
  }

  const user = await fetchCordRESTApi<ServerUpdateUser>(
    `users/${req.params.userID}`,
    'PUT',
    JSON.stringify(req.body),
  );
  res.send(user);
}
