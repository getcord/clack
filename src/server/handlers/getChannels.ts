import type { Request, Response } from 'express';

export function handleGetChannels(_: Request, res: Response) {
  res.send([
    'general',
    'any-questions',
    'clackless',
    'cordless',
    'design',
    'docs',
    'e',
    'ecosystem',
    'epicquotes',
    'impromptutor',
    'launch-team',
    'memes',
    'music',
    'noise',
    'notifications',
    'office',
    'p',
    'pets-of-cord',
    'random',
    'sdk',
    'the-cordially-book-club',
    'what-the-quack',
    'clack-allcustomers',
  ]);
}
