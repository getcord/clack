import type { Request } from 'express';
import * as cookie from 'cookie';

export function getCookie(req: Request, name: string): string | undefined {
  return cookie.parse(req.header('Cookie') || '')[name];
}
