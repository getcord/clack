import type { Request, Response } from 'express';

export type AuthSystem = {
  getAuthRedirect: (req: Request, res: Response) => string;
};

export type LoginTokenData = {
  user_id: string;
  name: string;
  email: string;
  picture: string;
};
