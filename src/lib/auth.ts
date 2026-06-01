import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.profileImage,
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as {role?: string}).role || 'candidate';
        token.id = user.id;
      }
      if (account?.provider === 'google' && token.email) {
        await connectDB();
        let dbUser = await User.findOne({ email: token.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: token.name,
            email: token.email,
            role: 'candidate',
            profileImage: token.picture,
            googleId: token.sub,
          });
        }
        token.role = dbUser.role;
        token.id = dbUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as {id?: string; role?: string}).id = token.id as string;
        (session.user as {id?: string; role?: string}).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
