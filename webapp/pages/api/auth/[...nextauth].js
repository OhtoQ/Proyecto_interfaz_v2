import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser } from "/src/lib/database";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { password, username } = credentials;

        const user = await getUser(username);

        if (user && user.password === password) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Adds the user id and groupsId data to the token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.groupsIds = user.groupsIds;
      }
      return token;
    },
    // Adds the user id and groupsId data to the session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.type = token.type;
      session.user.groupsIds = token.groupsIds;
      return session;
    },
  },
});
