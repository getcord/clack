import type { Request, Response } from 'express';

export function handleGetConfig(_req: Request, res: Response) {
  // Refer to https://developers.giphy.com/docs/api/ for a Giphy api key
  const giphy_api_key = process.env.GIPHY_API_KEY;
  res.send({ giphy_api_key });
}
