
import { z } from "zod";

export const SignInSchema = z.object({
    email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email("Please enter a valid email"),
   
    password: z
    .string()
    .min(1, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters." }),

})

export const SignUpSchema = z.object({
    firstname: z
    .string()
    .min(1,{message:"Firstname is Required"})
    .max(50,{message:"Firstname cannot exceed 50 characters"})
    .regex(/^[a-zA-Z\s]+$/, {
        message:"Firstname must be alphabets"
    }),
    lastname: z
    .string()
    .min(1,{message:"Lastname is Required"})
    .max(50,{message:"Lastname cannot exceed 50 characters"})
    .regex(/^[a-zA-Z\s]+$/, {
        message:"Lastname must be alphabets"
    }),

    email: z
    .string()
    .min(1, { message: "Email is Required" })
    .email("Please enter a valid email"),
    password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
    confirmPassword: z
    .string(),

}).refine((data)=> data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const ProfileSchema = z.object({
  firstname: z
  .string()
  .min(1,{message:"Firstname is Required"})
  .max(50,{message:"Firstname cannot exceed 50 characters"})
  .regex(/^[a-zA-Z\s]+$/, {
      message:"Firstname must be alphabets"
  }),
  lastname: z
  .string()
  .min(1,{message:"Lastname is Required"})
  .max(50,{message:"Lastname cannot exceed 50 characters"})
  .regex(/^[a-zA-Z\s]+$/, {
      message:"Lastname must be alphabets"
  }),

  email: z
  .string()
  .min(1, { message: "Email is Required" })
  .email("Please enter a valid email"),
 
  location: z
  .string()
  .max(50,{message:"Location cannot exceed 50 characters"})
  ,
  
  work: z
  .string()
  .max(50,{message:"Work cannot exceed 50 characters"})
  ,

  contact: z
  .string()
  .max(50,{message:"Lastname cannot exceed 50 characters"})
  .regex(/[0-9]/, {
      message:"Numbers only"
  }),

})

export const AddPost = z.object({
  Content:z
  .string()
  .min(1,{message:"Content is Required"})
  .max(50,{message:"Content cannot exceed 50 characters"}),
  Pros:z
  .string()
  .min(1,{message:"Content is Required"})
  .max(50,{message:"Pros cannot exceed 50 characters"}),
  Cons:z
  .string()
  .min(1,{message:"Content is Required"})
  .max(11,{message:"Pros cannot exceed 11 characters"})
})

export const AddComment = z.object({
  Comment:z
  .string()
  .min(1,{message:"Content is Required"})
  .max(50,{message:"Pros cannot exceed 50 characters"})
})

export const ResetPassword = z.object({
  password: z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(50, { message: "Password cannot exceed 50 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  }),
  confirmPassword: z
  .string()
}).refine((data)=> data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})