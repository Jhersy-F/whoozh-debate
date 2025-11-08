'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RootState } from '../../GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { showModal, closeModal } from '@/GlobalRedux/Features/showModalSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SignUpSchema } from '@/lib/validations'; // Assuming you have a RegisterSchema
import { useToast } from "@/hooks/use-toast"
import { createUser } from '@/lib/api';

export default function Component() {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  let userId = '';
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
  });

  const handleCloseregister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(closeModal());
  };

  const handleShowModal = (modalname: string) => {
    dispatch(showModal({ modalname: modalname }));
  };
  const showSuccessToast = () => {
    toast({
      title: "Success",
      description: "Successfully Registered!",
      className: "bg-[#416F5F] text-white ",
      duration: 3000,
    })
  }
  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    showSuccessToast()
    //const addUser = 
    const result = await createUser(data);

    if (result.errors) {
      setMessage('Email already exists');
    } else {
     // setMessage('User created successfully!');
      userId = result.data.addUser.id;
      console.log(userId);
    }
    if (!userId) {
      console.error('userID is required');
      console.log(result.errors);
      return; // Exit if userID is not provided
    }
    const addAccount = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            addAccount(
              userID: "${userId}", 
              provider: "credentials", 
              providerAccountID: "${data.email}", 
              password: "${data.password}", 
              image: ""
            ) {
              id
              userID
              provider
              providerAccountID
              image
            }
          }
        `,
      }),
    });

    const resultaccount = await addAccount.json();
    console.log(resultaccount);
  };

  // redux states
  const modalname = useSelector((state: RootState) => state.modalSlice.modalname);
  const show = useSelector((state: RootState) => state.modalSlice.showmodal);

  // handle closing the modal when clicking around it
  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as Element;
    if (!target.closest('#modal')) {
      dispatch(closeModal());
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, );

  return (
    <div
      className={`${
        show && modalname === 'register' ? 'flex' : 'hidden'
      } fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4`}
    >
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative" id="modal">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={handleCloseregister}>
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter email"
            {...register('email')}
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          {message && <p className="text-red-500">{message}</p>}
          <Input
            type="text"
            placeholder="First Name"
            {...register('firstname')}
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
          <Input
            type="text"
            placeholder="Last Name"
            {...register('lastname')}
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
            className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="#" className="text-blue-400 hover:underline" onClick={() => handleShowModal('login')}>
            Sign in
          </a>
        </p>
      </div>
  
    </div>
  );
}