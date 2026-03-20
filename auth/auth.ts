import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
// import { prisma } from '@/lib/prisma';  // Uncomment when Prisma is set up
// import bcrypt from 'bcryptjs';

// ============================================================
// NEXT AUTH CONFIG — Place at: auth.ts (project root)
//
// npm install next-auth@beta @auth/prisma-adapter
//
// Features:
//   - Google & GitHub OAuth
//   - Email/Password login
//   - Session management
//   - Prisma database adapter
//   - Role-based access
//
// Setup:
//   1. Create OAuth apps at:
//      - Google: https://console.cloud.google.com/apis/credentials
//      - GitHub: https://github.com/settings/applications/new
//   2. Add env vars (see .env.template)
//   3. Set up Prisma schema (see database/schema.prisma)
// ============================================================

const config: NextAuthConfig = {
  // --- Database Adapter ---
  // adapter: PrismaAdapter(prisma),  // Uncomment when Prisma is ready

  // --- Authentication Providers ---
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // Email + Password (credentials)
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Lozinka', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email i lozinka su obavezni');
        }

        // --- Replace with your actual user lookup ---
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email as string },
        // });
        //
        // if (!user || !user.password) {
        //   throw new Error('Neispravni podaci za prijavu');
        // }
        //
        // const isValid = await bcrypt.compare(
        //   credentials.password as string,
        //   user.password
        // );
        //
        // if (!isValid) {
        //   throw new Error('Neispravni podaci za prijavu');
        // }
        //
        // return {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name,
        //   image: user.image,
        //   role: user.role,
        // };

        // Placeholder — remove in production
        throw new Error('Configure database before using credentials login');
      },
    }),
  ],

  // --- Session Strategy ---
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // --- Custom Pages ---
  pages: {
    signIn: '/login',
    // signUp: '/register',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify',
  },

  // --- Callbacks ---
  callbacks: {
    // Add role to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user';
        token.id = user.id;
      }
      return token;
    },

    // Add role to session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },

    // Control who can sign in
    async signIn({ user, account }) {
      // Block specific emails or domains:
      // if (user.email?.endsWith('@blocked.com')) return false;
      return true;
    },

    // Redirect after auth
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // --- Events (logging, analytics) ---
  events: {
    async signIn({ user, account }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${(token as any)?.email}`);
    },
  },

  // --- Security ---
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);


// ============================================================
// HELPER: Require authentication in server components
//
// Usage in page.tsx:
//   const session = await requireAuth();
//   // session.user is guaranteed to exist
// ============================================================

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('UNAUTHORIZED');
    // Or redirect: redirect('/login');
  }
  return session;
}


// ============================================================
// HELPER: Require specific role
//
// Usage:
//   const session = await requireRole('admin');
// ============================================================

export async function requireRole(role: string) {
  const session = await requireAuth();
  if ((session.user as any).role !== role) {
    throw new Error('FORBIDDEN');
  }
  return session;
}
