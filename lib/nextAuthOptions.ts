import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getUserByEmail, comparePassword } from "@/utils/authHelpers";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  NODE_ENV,
} = process.env;
const isDev = NODE_ENV === "development";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        isDev && console.log("🔑 [Credentials Login Attempt]", credentials.email);

        const user = await getUserByEmail(credentials.email);
        if (!user || !user.password) throw new Error("Use Google or GitHub login for this account.");

        const isValid = await comparePassword(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: (user._id as ObjectId).toString(),
          email: user.email,
          name: user.userName || user.name || "User",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      isDev && (user || token) && console.log("🧩 [JWT Callback]", { token, user });
      if (user) token.userId = (user as any).id || (user as any)._id;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.userId;
      (session as any).mfaRequired = false; // reserved for future MFA
      return session;
    },
  },
  secret: NEXTAUTH_SECRET!,
};
