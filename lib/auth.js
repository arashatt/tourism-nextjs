import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { name: credentials.identifier },
            ],
          },
        });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id, role: user.role,email: user.email, name: user.names};
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role;
      token.name = user.name;
      token.email = user.email;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;

    }
    return session;
  },
  async redirect({ url, baseUrl }) {
    return baseUrl + '/';
  },
},

  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

