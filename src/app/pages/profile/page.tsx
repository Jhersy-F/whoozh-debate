"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { showModal } from '@/GlobalRedux/Features/showModalSlice';
import { PencilIcon, MapPinIcon, PhoneIcon, BriefcaseIcon, KeyRound } from 'lucide-react'
import {  useDispatch } from 'react-redux';
import EditProfile from '@/components/modals/editprofile';
import EditPicture from '@/components/modals/editpicture';
import EditPassword from '@/components/modals/editpassword';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
export default function Component() {

 const dispatch = useDispatch();
 const [profile, setProfile] = useState({
      firstname: '',
      email: '',
      location: '',
      contact: "0",
      work: '',
      avatar: '/images/userprofile.png'
    })
const { data: session } = useSession();
const userID = session?.user?.id;
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
     
        if (result.data) {
          setProfile(result.data.getUserByID);
        }
        //console.log(profile)
      };
  
       
      fetchUser()
     
    
    }, [userID]);


 const handleShowModal = (modalname: string) => {
    dispatch(showModal({ modalname: modalname }));
  };
 

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-800 ">
        <div className="h-48 bg-gradient-to-r from-[#B666D2] to-[#F03D5C]"></div>
        <div className="absolute top-32 left-8">
          <div className="relative">
            <Image
              src={profile.avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              height={100}
              width={100}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full shadow-md"
              onClick={() => handleShowModal('editpicture')}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="pt-20 pb-8 px-4">
          <div className="flex flex-col lg:flex-row  md:flex-row justify-between items-start ">
            <div >
              <h1 className="text-3xl font-bold text-white">{profile.firstname}</h1>
              <p className="text-lg text-blue-600">{profile.email}</p>
            </div>
            <div className=" grid  grid-cols-2  justify-between gap-2 ">
            <Button onClick={() => handleShowModal('editpass')} className="gap-2 mt-4 text-xs md:text-sm">
                <KeyRound className="w- h-4 lg:block px-0" />
                <span className='pl-0 -ml-1'> Reset Password</span>
               
              </Button>
              <Button onClick={() => handleShowModal('editprofile')} className="gap-2 mt-4 text-xs md:text-sm">
                <PencilIcon className="w-4 h-4  lg:block p-0 m-0" />
                Edit Profile
              </Button>
             
            </div>
           
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-white">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center text-white">
              <PhoneIcon className="h-5 w-5 mr-2" />
              <span>{profile.contact}</span>
            </div>
            <div className="flex items-center text-white">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              <span>{profile.work}</span>
            </div>
          </div>
        </div>
      </div>
    <EditProfile/>
    <EditPicture/>
    <EditPassword/>
    </div>
  )
}