import { SignUpSchema } from '@/lib/validations'; // Assuming you have a RegisterSchema
import * as z from 'zod';
export async function createUser(data: z.infer<typeof SignUpSchema>){
    try {
       
const result = await fetch('/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation AddUser($email: String!, $firstname: String!, $lastname: String!, $location: String!, $work: String!, $contact: String!, $avatar: String!) {
        addUser(
          email: $email,
          firstname: $firstname,
          lastname: $lastname,
        
        ) {
          id
          email
          firstname
          lastname
         
        }
      }
    `,
    variables: {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
    
    }
  }),
})       ;

        // Check for HTTP errors
        if (!result.ok) {
            const errorMessage = `HTTP Error ${result.status}: ${result.statusText}`;
            console.error('HTTP Error in createUser:', errorMessage);
            throw new Error(errorMessage);
        }

        // Safely parse JSON
        let json: { data?: any; errors?: Array<{ message: string }> };
        try {
            json = await result.json();
        } catch (parseError) {
            const errorMessage = 'Failed to parse JSON response';
            console.error('JSON Parse Error in createUser:', parseError);
            throw new Error(errorMessage);
        }

        // Check for GraphQL errors
        if (json.errors && json.errors.length > 0) {
            const errorMessage = `GraphQL Error: ${json.errors.map((err: any) => err.message).join(', ')}`;
            console.error('GraphQL Error in createUser:', json.errors);
            throw new Error(errorMessage);
        }

        return json.data;
    } catch (error) {
        console.error('Error in createUser function:', error);
        throw error;
    }
} 




