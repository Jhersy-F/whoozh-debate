import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';

import typeDefs from '@/graphql/schema';
import resolvers from '@/graphql/resolvers';
import dbConnect from '@/utils/dbConnect';

// Create a new instance of the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable GraphQL Playground in development
});

// This is the new way to create a Next.js handler with Apollo.
// It connects to your database before handling the request.
const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    // Connect to the database here
    try {
      await dbConnect();
    } catch (error) {
      console.error('Database connection failed:', error);
    }
    // Return the request and response as context
    return { req, res };
  },
});

// We can now export the same handler for both GET and POST requests.
// This is the correct pattern for the App Router's 'route.ts' file.
export { handler as GET, handler as POST };
