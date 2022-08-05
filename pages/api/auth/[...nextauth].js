import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        const baseUrl = process.env.NEXTAUTH_URL;
        const response = await fetch(`${baseUrl}/rest/api/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.token) {
          const responseUsuario = await fetch(baseUrl + '/rest/api/auth/user',
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${data.token}`,
              },
            }
          );

          const dataUsuario = await responseUsuario.json();
          const usuario = dataUsuario.user

          const user = {...usuario, token: data.token}

          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;  // Setting token in session
      return session;
    },
  },
  pages: {
    signIn: "/login", //Need to define custom login page (if using)
  },
});