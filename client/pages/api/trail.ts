import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line camelcase
import { unstable_getServerSession } from 'next-auth/next';

import { createTrail, deleteTrail, getTrail, updateTrail } from '@/lib/api';
import { HttpMethod } from '@/types';

import { authOptions } from './auth/[...nextauth]';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getTrail(req, res, session);
    case HttpMethod.POST:
      return createTrail(req, res);
    case HttpMethod.DELETE:
      return deleteTrail(req, res);
    case HttpMethod.PUT:
      return updateTrail(req, res);
    default:
      res.setHeader('Allow', [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.PUT,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
