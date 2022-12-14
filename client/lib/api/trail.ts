import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';

import prisma from '@/lib/prisma';

import type { Trail } from '.prisma/client';

/**
 * Get Trail
 *
 * Fetches & returns either a single or all trails available depending on
 * whether a `trailId` query parameter is provided. If not all trails are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getTrail(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<void | NextApiResponse<Array<Trail> | (Trail | null)>> {
  const { trailId } = req.query;

  if (Array.isArray(trailId))
    return res
      .status(400)
      .end('Bad request. trailId parameter cannot be an array.');

  if (!session.user.id)
    return res.status(500).end('Server failed to get session user ID');

  try {
    if (trailId) {
      const settings = await prisma.trail.findFirst({
        where: {
          id: trailId,
          user: {
            id: session.user?.id,
          },
        },
      });

      return res.status(200).json(settings);
    }

    const trails = await prisma.trail.findMany({
      where: {
        user: {
          id: session.user?.id,
        },
      },
    });

    return res.status(200).json(trails);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Trail
 *
 * Creates a new trail from a set of provided query parameters.
 * Once created, the trails new `trailId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function createTrail(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void | NextApiResponse<{
  trailId: string;
}>> {
  const {
    name,
    txnHash,
    difficulty,
    quantity,
    collectionAddress,
    price,
    tokenId,
    image,
    description,
    from,
    to,
    ownerId,
  } = req.body;

  try {
    const response = await prisma.trail.create({
      data: {
        name,
        description,
        image,
        from,
        to,
        tokenId,
        txnHash,
        difficulty,
        collectionAddress,
        quantity,
        price,
        owner: {
          connect: {
            id: ownerId,
          },
        },
      },
    });

    return res.status(201).json({
      trailId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Trail
 *
 * Deletes a trail from the database using a provided `trailId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteTrail(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void | NextApiResponse> {
  const { trailId } = req.query;

  if (Array.isArray(trailId))
    return res
      .status(400)
      .end('Bad request. trailId parameter cannot be an array.');

  try {
    await prisma.$transaction([
      prisma.trail.delete({
        where: {
          id: trailId,
        },
      }),
    ]);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update trail
 *
 * Updates a trail & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - currentSubdomain
 *  - name
 *  - description
 *  - image
 *  - imageBlurhash
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateTrail(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void | NextApiResponse<Trail>> {
  const {
    id,
    name,
    txnHash,
    difficulty,
    collectionAddress,
    quantity,
    price,
    image,
    description,
    from,
    to,
    ownerId,
  } = req.body;

  try {
    const response = await prisma.trail.update({
      where: {
        id,
      },
      data: {
        name,
        txnHash,
        difficulty,
        collectionAddress,
        quantity,
        price,
        image,
        description,
        from,
        to,
        ownerId,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
