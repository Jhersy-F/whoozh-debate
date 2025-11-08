"use server";

import { signIn } from '@/auth';
import handleError from '../handlers/error';
export async function signInWithCredentials(data: { email: string; password: string,redirect:boolean}):Promise<ActionResponse> {
    try {
        await signIn('credentials', data);
         
        return {success:true};
    } catch (error) {
        handleError(error);
       return handleError(error) as ErrorResponse;
    }
    
}