'use client'

import React, { useEffect , useState } from 'react';
import { PencilIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../GlobalRedux/store';
import { closeModal } from '@/GlobalRedux/Features/showModalSlice';
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProfileSchema } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
export default function EditProfile() {
    const { data: session } = useSession();
    const userID = session?.user?.id;
    const dispatch = useDispatch();
    const { toast } = useToast()
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors }, 
    } = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues:{
          firstname: '',
          lastname: '',
          email: '',
          location: '',
          contact: '',
          work: '',
       
        },
    })
     const handleClose = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(closeModal());
      };
    const show = useSelector((state: RootState) => state.modalSlice.showmodal);
    const modalname = useSelector((state: RootState) => state.modalSlice.modalname);
 
    useEffect(() => {
      console.log(userID)
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
                  lastname
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
       
        if (result.data) {
          reset(result.data.getUserByID);
        }
    
      };
  
       
      fetchUser()
     
    
    }, [userID,reset]);
    const showSuccessToast = () => {
      toast({
        title: "Success",
        description: "Successfully Updated!",
        className: "bg-[#416F5F] text-white ",
        duration: 3000,
      })
    }   

  
    
    const onSubmit = async (data : z.infer<typeof ProfileSchema>) => {
      
      console.log(userID)
      if (!userID) return; // Exit if userID is not set
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation {
                updateProfile(
                  id: "${userID}"
                  firstname:"${data.firstname}"
                  lastname:"${data.lastname}"
                  location:"${data.location}"
                  contact:"${data.contact}"
                  work:"${data.work}"
                ) {
                  id
                  firstname
                  lastname
                  email
                  location
                  contact
                  work
                
                }
              }
            `,
          }),
        });
       
        const result = await response.json();
  
        console.log(result)
        if (result.data) {
          showSuccessToast()
         
        }
       dispatch(closeModal());
    }
  return (
    <Dialog open={show&&modalname=='editprofile'?true:false} >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PencilIcon className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
            <DialogClose className="absolute right-6 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" onClick={handleClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Firstname</Label>
              <Input
                id="firstname"
                type='text'
              
                {...register('firstname')}
               
              />
                {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Lastname</Label>
              <Input
                id="lastname"
                {...register('lastname')}
              
         
              />
               {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register('email')}
                type="email"
                disabled
             
              />
              
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="location"
                {...register('location')}
               
          
              />
               {errors.location && <p className="text-red-500">{errors.location.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                {...register('contact')}
             
              />
              {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="work">Work</Label>
              <Input
                id="work"
                {...register('work')}
              
              />
                 {errors.work && <p className="text-red-500">{errors.work.message}</p>}
           
            </div>
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
