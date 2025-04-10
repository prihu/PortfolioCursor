import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log("No user found with email:", credentials.email);
          return null;
        }

        // Ensure user.password is not null or undefined before comparison
        if (!user.password) {
          console.log("User found but password hash is missing:", credentials.email);
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (isValidPassword) {
          console.log("Password valid for user:", user.email);
          // Return necessary user details, ensure id is a string if expected by JWT callback
          return {
            id: user.id.toString(), // Assuming id is a number or BigInt in Prisma, convert to string
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } else {
          console.log("Invalid password for user:", user.email);
          return null;
        }
      },
    }),
    // ...add more providers here if needed
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Ensure user.id exists and is a string
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Ensure session.user exists and token.id is assigned
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  // pages: { ... } // Optional custom pages
  // adapter: PrismaAdapter(prisma), // Optional Prisma adapter
}; 