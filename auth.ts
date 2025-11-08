import NextAuth from "next-auth";
import Google from "next-auth/providers/google"

import  Credentials  from "next-auth/providers/credentials";

//const client = new MongoClient(String(process.env.MONGODB_URI));
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';



export const {handlers,signIn,signOut,auth} = NextAuth({
secret: process.env.AUTH_SECRET,
providers: [
   Google({
     clientId: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   }),    Credentials({
        credentials: {
             email: { type: "email" },
             password: { type: "password" },
        },
        authorize: async (credentials) => {   
            // Perform login
                const response = await fetch(`${NEXTAUTH_URL}/api/graphql`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    query: `
                      mutation Login($email: String!, $password: String!) {
                        login(email: $email, password: $password) {
                          id
                          firstname
                          email
                        }
                      }
                    `,
                    variables: {
                      email: credentials.email,
                      password: credentials.password,
                    },
                  }),
                });
            
                const result = await response.json();
                if (result.errors) {
                  // Handle errors (e.g., invalid credentials)
                  throw new Error("Invalid credentials.")
                } else {
                  const user = result.data.login;
                  // Assuming the response contains user data and a token
                  //const { id, name, token } = result.data.login;
            
                  // Store user information (e.g., in local storage or Redux store)
                 return user || null;
                 
                  
                
                }
              
        }    })
],
callbacks:{
  async jwt({token,user}){
    
    if(user){
    
      token.id = user.id;
      token.email = user.email;
      
    }
    return token;  },
  async session({session,token}){
    if(!token) return session;
    if(session.user) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;

    }
   
    
    return session;

   },
    
  },
 
    session: {
    strategy: "jwt",
  },
})
