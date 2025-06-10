import NextAuth from 'next-auth';
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
        identifier: { label: 'Username or Email', type: 'text' }, // Changed to identifier
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("Attempt login with:", credentials);
        if (!credentials?.identifier || !credentials?.password) {
          console.log("null returned: missing identifier or password");
          return null;
        }

        // Check for user by email or name
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { name: credentials.identifier },
            ],
          },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          console.log("authentication success");
          return { id: user.id, name: user.name, email: user.email };
        } else {
          console.log("authentication failed");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + '/';
    },
  },
  pages: {
    signIn: '/login', // Custom sign-in page
    error: '/login', // Redirect errors to custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
