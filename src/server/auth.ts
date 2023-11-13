import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { compare } from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      emailConfirmed: boolean;
      name: string;
      role: string;
    };
  }
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  //adapter: PrismaAdapter(db),
  secret: process?.env?.AUTH_SECRET,
  pages: {
    signIn: `/signin`,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (!user) throw new Error("Invalid email or password");

          const isMatch = await compare(credentials.password, user.password);
          if (!isMatch) throw new Error("Invalid email or password");

          return user;
        } catch (err: any) {
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      const user = await db.user.findUniqueOrThrow({
        where: {
          id: token?.user?.id,
        },
        select: {
          id: true,
          email: true,
          emailConfirmed: true,
          name: true,
          role: true,
        },
      });
      session.user = user as any;
      return session;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
