import type { Request, Response } from 'express';
import { FAKE_USERS } from 'src/common/fakeusers';
import { ensureMemberOfEveryoneOrg, addLoginCookie } from 'src/server/auth';
import type { LoginTokenData, AuthSystem } from 'src/server/auth';
import { FRONT_END_HOST } from 'src/server/consts';

export function makeFakeAuth(): AuthSystem {
  return {
    getAuthRedirect: function () {
      return `${FRONT_END_HOST}/fakeLogin`;
    },
  };
}

export async function handleFakeLogin(req: Request, res: Response) {
  const userID = req.query.user;
  const state = req.query.state;

  if (!(typeof userID === 'string' && typeof state === 'string')) {
    res.sendStatus(400);
    return;
  }

  const fakeUser = FAKE_USERS[userID as keyof typeof FAKE_USERS];
  if (!fakeUser) {
    res.sendStatus(400);
    return;
  }

  await ensureMemberOfEveryoneOrg(userID);

  const tokenData: LoginTokenData = {
    user_id: userID,
    name: fakeUser.name,
    picture: fakeUser.profilePictureURL,
  };

  addLoginCookie(res, tokenData);

  res.send({ redirect: state });
}
