// pages/api/graphql.ts
import { ApolloServer } from 'apollo-server-micro';
import dbConnect from '@/utils/dbConnect'; // Create this utility to connect to MongoDB
import typeDefs from '@/graphql/schema';
import resolvers from '@/graphql/resolvers';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: false,
});

const startServer = apolloServer.start();

export default async function handler(req:any, res:any) {
  try {
    await dbConnect(); 
    await startServer; // Ensure the server is started before handling requests
    return apolloServer.createHandler({ path: '/api/graphql' })(req, res);
  } catch (error) {
    console.error(" Error in GraphQL API:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for Apollo Server
  },
};