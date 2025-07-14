// lib/auth.ts
import { PrismaClient } from './generated/prisma';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  secret: "mysupersecretkey123456789abcdefghijklmnop",
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, name, action } = credentials ?? {};

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        if (action === 'register') {
          if (user) throw new Error('User already exists');

          const hashed = await bcrypt.hash(password, 12);
          const newUser = await prisma.user.create({
            data: { email, password: hashed, name: name || email.split('@')[0] },
          });

          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }

        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
