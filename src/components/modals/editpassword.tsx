'use client'

import React, { useEffect , useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X, Eye, EyeOff, PencilIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../GlobalRedux/store';
import { closeModal } from '@/GlobalRedux/Features/showModalSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPassword } from '@/lib/validations';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function EditPassword() {
    const { data: session } = useSession();
    const userID = session?.user?.id;
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirm, setShowConfirm] = useState(false);
    const { toast } = useToast();
    const showSuccessToast = () => {
      toast({
        title: "Success",
        description: "Successfully Updated!",
        className: "bg-[#416F5F] text-white ",
        duration: 3000,
      })
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm<z.infer<typeof ResetPassword>>({
        resolver: zodResolver(ResetPassword),
      });
   
    
     const handleClose = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(closeModal());
      };
    const show = useSelector((state: RootState) => state.modalSlice.showmodal);
    const modalname = useSelector((state: RootState) => state.modalSlice.modalname);
   
    useEffect(() => {
      const fetchUser  = async () => {
        if (!userID) return; // Exit if userID is not set
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                getUserByID(id: "${userID}") {
                  id
                  firstname
                  email
                  location
                  contact
                  work
                  avatar
                }
              }
            `,
          }),
        });
     
        const result = await response.json();
        console.log(result.data.getUserByID)
        if (result.data) {
          //setProfile(result.data.getUserByID);
          reset(result.data.getUserByID)
        }
    
      };
  
       
      fetchUser()
     
    
    }, [userID,reset]);
      
  /*const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if(name=="contact"){
     
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      const truncatedValue = numericValue.slice(0, 11); 
      setProfile((prev) => ({
        ...prev,
        [name]: truncatedValue,
      }));

      if (truncatedValue.length !== 11) {
       // setError("Contact must be exactly 11 digits.");
      } else {
       // setError("");
      }
    }
    else{
      setProfile(prev => ({ ...prev, [name]: value }))
    }
  
   
  }*/
  
    
    const onSubmit = async (data: z.infer<typeof ResetPassword>) => {
     
      if (!userID) return; // Exit if userID is not set
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation {
                resetPassword(
                  userID: "${userID}",
                  password: "${data.password}"
                ) {
                  id
                  userID
                }
              }
            `,
          }),
        });
       
        const result = await response.json();
        console.log(result)
        if(result.data){
          showSuccessToast()
        }
       dispatch(closeModal());
    }
  return (
    <Dialog open={show&&modalname=='editpass'?true:false} >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PencilIcon className="w-5 h-5" />
              Reset Password
            </DialogTitle>
            <DialogClose className="absolute right-6 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" onClick={handleClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2 relative">
            <Label htmlFor="name">New Password</Label>
            <Input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
            />
             <Button
              type="button"
              variant="ghost"
         
              className="absolute right-0 top-10 transform -translate-y-1/2 hover:bg-transparent  " // Position the button
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 " />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide Password' : 'Show Password'}
              </span>
            </Button>
          </div>
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <div className="grid gap-2 relative">
              <Label htmlFor="email">Confirm Password</Label>
              <Input
                id="confirm"
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
              />
              <Button
              type="button"
              variant="ghost"
         
              className="absolute right-0 top-10 transform -translate-y-1/2 hover:bg-transparent  " // Position the button
              onClick={() => setShowConfirm(!showConfirm)} // Toggle password visibility
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4 " />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirm ? 'Hide Password' : 'Show Password'}
              </span>
            </Button>
            </div>
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      
      </Dialog>
  )
}
