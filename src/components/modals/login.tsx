'use client';
import { useState, useEffect, Suspense } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RootState } from '../../GlobalRedux/store';
import { useSelector, useDispatch } from 'react-redux';
import { showModal, closeModal } from '@/GlobalRedux/Features/showModalSlice';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SignInSchema } from '@/lib/validations'
import { signInWithCredentials } from '@/lib/actions/auth.action';
import { useToast } from '@/hooks/use-toast';
export default function Login() {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast()
  const show = useSelector((state: RootState) => state.modalSlice.showmodal);
  const modalname = useSelector((state: RootState) => state.modalSlice.modalname);
const showErrorToast = () => {
    toast({
      title: "Error",
      description: "Wrong username or Password!",
      className: "bg-[#416F5F] text-white ",
      duration: 3000,
    })
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });
  
  const handleLogin = async (data: z.infer<typeof SignInSchema>) => {
    

    const signin =  await signInWithCredentials({ email: data.email, password: data.password, redirect:false });
    console.log(signin);
    if(signin?.success){
    dispatch(closeModal());
    
    router.push('/pages/homepage');
    }
    else{
      showErrorToast()
    }
   
   
  };

  const handleShowModal = (modalname: string) => {
    dispatch(showModal({ modalname: modalname }));
  };

  const handleCloselogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(closeModal());
  };

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
    <Suspense fallback={<p>Loading home...</p>}>
      <div
      className={`${show && modalname === 'login' ? 'flex' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 `}
    >
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative " id="modal">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          aria-label="Close"
          onClick={handleCloselogin}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Sign In</h2>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
            
              placeholder="Email"
              {...register('email')}
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
            {errors.password && <p className="text-red-500 space-y-4">{errors.password.message}</p>}
            {error && <p className="text-red-500 space-y-4">Wrong Email or Password</p>}
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          <a href="#" className="text-blue-400 hover:underline" onClick={() => handleShowModal('register')}>
            Create new account
          </a>
        </p>
      </div>
    </div>
    </Suspense>
    
  );
}