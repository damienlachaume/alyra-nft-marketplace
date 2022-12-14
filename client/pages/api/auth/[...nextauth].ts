import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions, Session, User } from 'next-auth';
import NextAuth from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

import prisma from '@/lib/prisma';

// AuthOptions with request authorize
export const authOptions: NextAuthOptions = {
  useSecureCookies: false,
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req: any) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || '{}'),
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL as string);

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: '/login', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
      user: User | AdapterUser;
    }) {
      session.address = token.sub as string;
      if (session?.user) {
        session.user.id = token.uid;
      }
      session.user = { ...session.user };
      session.user.image = 'https://www.fillmurray.com/128/128';
      const upUser = await prisma.user.upsert({
        where: {
          walletAddress: session.address,
        },
        update: {},
        create: {
          walletAddress: session.address,
        },
      });
      session.user = { ...session.user, ...upUser };
      return session;
    },
  },
};

export default NextAuth(authOptions);
