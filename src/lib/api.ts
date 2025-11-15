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
      mutation AddUser($email: String!, $firstname: String!, $lastname: String!) {
        addUser(
          email: $email,
          firstname: $firstname,
          lastname: $lastname
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
            return { errors: [{ message: errorMessage }] };
        }

        // Safely parse JSON
        let json: { data?: any; errors?: Array<{ message: string }> };
        try {
            json = await result.json();
        } catch (parseError) {
            const errorMessage = 'Failed to parse JSON response';
            console.error('JSON Parse Error in createUser:', parseError);
            return { errors: [{ message: errorMessage }] };
        }

        // Return the full response (which may include errors or data)
        return json;
    } catch (error) {
        console.error('Error in createUser function:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { errors: [{ message: errorMessage }] };
    }
} 




