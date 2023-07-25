import type { Request, Response } from 'express';

export function handleGetChannels(_: Request, res: Response) {
  res.send(['general', 'what-the-quack', 'e', 'random', 'clack-allcustomers']);
}
