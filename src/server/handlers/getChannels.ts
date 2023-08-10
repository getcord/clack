import type { Request, Response } from 'express';

export function handleGetChannels(_: Request, res: Response) {
  res.send([
    // Please keep first (most useful):
    'general',

    // Please keep in alphabetical order (main channels):
    'any-questions',
    'clack-allcustomers',
    'clackless',
    'cordless',
    'design',
    'docs',
    'e',
    'ecosystem',
    'epicquotes',
    'impromptutor',
    'launch-team',
    'life-snaps',
    'marketing',
    'memes',
    'music',
    'notifications',
    'office',
    'p',
    'pets-of-cord',
    'random',
    'sdk',
    'the-cordially-book-club',

    // Please keep last (testing/spamming):
    'noise',
    'what-the-quack',
  ]);
}
