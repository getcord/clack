import type { ServerGetUser } from '@cord-sdk/types';
import type { Request, Response } from 'express';
import { fetchCordRESTApi } from 'src/server/fetchCordRESTApi';

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
  'infected-gems': null,
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
  'super-fake-secret-channel': 'org-that-doesnt-exist',
  'super-secret-channel': 'super-secret-org',
  'the-cordially-book-club': null,
  til: null,
  website: null,

  // Please keep last (testing/spamming):
  noise: null,
  'what-the-quack': null,
};

export async function handleGetChannels(req: Request, res: Response) {
  const { user_id } = (req as any).loginTokenData;
  const { organizations } = await fetchCordRESTApi<ServerGetUser>(
    `users/${user_id}`,
  );

  const availableChannels = Object.entries(allChannels).reduce(
    (acc, [key, value]) => {
      if (value === null || organizations.includes(value)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string | null>,
  );

  res.send(availableChannels);
}
