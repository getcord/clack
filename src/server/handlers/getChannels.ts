import type { Request, Response } from 'express';

/**
 * Map of channel name to the org that determines the channel's membership (or
 * null if it should be "everyone").
 */
const allChannels: Record<string, string | null> = {
  // Please keep first (most useful):
  general: null,

  // Please keep in alphabetical order (main channels):
  'any-questions': null,
  'clack-allcustomers': null,
  clackless: null,
  cordathon: null,
  cordless: null,
  design: null,
  docs: null,
  e: null,
  ecosystem: null,
  epicquotes: null,
  impromptutor: null,
  'launch-team': null,
  'life-snaps': null,
  marketing: null,
  memes: null,
  music: null,
  notifications: null,
  office: null,
  p: null,
  'pets-of-cord': null,
  random: null,
  sdk: null,
  'the-cordially-book-club': null,
  til: null,
  website: null,

  // Please keep last (testing/spamming):
  noise: null,
  'what-the-quack': null,
};

export function handleGetChannels(_: Request, res: Response) {
  // TODO: do a REST API call and filter this down based on your orgs.
  res.send(allChannels);
}
