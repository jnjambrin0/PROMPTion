import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through an object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // This is where you'd integrate with your user database.
        // For now, we'll use the in-memory store from the register route (not ideal for real apps).
        // This requires a way to access the 'users' array from 'app/api/auth/register/route.ts'.
        // For simplicity in this mock, we'll assume it's globally accessible or re-declare it.
        // In a real app, 'users' would come from a database query.

        // Mock: Re-declaring users for demonstration as direct import from a POST route isn't typical.
        // Ideally, this logic would be in a shared user service.
        const users: any[] = (global as any).InMemoryUsers || []; // Access global or initialize
        if (!(global as any).InMemoryUsers) {
            (global as any).InMemoryUsers = users; // Initialize if not present
        }


        if (!credentials?.email || !credentials.password) {
          return null;
        }

        console.log("Attempting to authorize user:", credentials.email);
        console.log("Current in-memory users:", users);


        const user = users.find(u => u.email === credentials.email);

        if (user && user.password === credentials.password) { // Plain text password check (BAD PRACTICE!)
          console.log("User found and password matches (mock):", user);
          return { id: user.id, name: user.name, email: user.email }; // Return user object
        } else {
          console.log("User not found or password mismatch");
          return null; // Authentication failed
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // Direct users to custom login page
    // error: '/auth/error', // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user ID to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session strategy
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure NEXTAUTH_SECRET is set in your .env
})

export { handler as GET, handler as POST }
// It's also good practice to ensure the register route shares the same 'users' array
// or uses a proper database. For this example, we'll try to use a global to share it.
// In app/api/auth/register/route.ts, you'd also use (global as any).InMemoryUsers.
