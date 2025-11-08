    'use client'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import React, { useState, useEffect } from "react"
import { MessageSquare, CirclePlus, CircleMinus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {countComment, countChoice, getcountJoined} from "@/hooks/useFetchData"
import { useDispatch } from "react-redux"
import { showModal } from "@/GlobalRedux/Features/showModalSlice";
import  Choices  from "@/components/modals/choices";

import { timeAgo } from "@/utils/dateCalculation"
import { useSession } from "next-auth/react"
export default function DebateCard({ user, time, question, postID, pros, cons, yourpost,userid }: { user: string; time: string; question: string, postID: string, pros: string, cons: string, yourpost?:boolean,userid:string}) {
  
  const [commentCount, setCommentCount] = useState(0);
  const [countPros, setcountPros] = useState(0);
  const [countCons, setcountCons] = useState(0);
  const [countJoined, setcountJoined] = useState(0);
  const router = useRouter()
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const userID = session?.user?.id;
  useEffect(() => {
    const fetchData = async () => {
      const commentCount = await countComment(postID);
      setCommentCount(commentCount);

      const prosCount = await countChoice(postID,"pros");
      setcountPros(prosCount);

      const consCount = await countChoice(postID,"cons");
      setcountCons(consCount);
      if(userID){
        const joinedCount = await getcountJoined(postID, userID)
        setcountJoined(joinedCount);
      }
  
    }
    fetchData()
    }, [userID,postID]);
      const handleShowCreate = (modalname:string)=>{
        dispatch(showModal({modalname:modalname}));
        
      }
      const routeToDebateroom = ()=>{
        router.push(`/pages/debateroom?postID=${postID}`)
      }
    
    
    // Example usage:
   
    
   // Output will depend on the current date and time

     
      
        return (
          <div className="bg-gray-800 p-4 rounded-lg z-0">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" alt={user} />
                <AvatarFallback>{user[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{user}</span>
              <span className="text-gray-400 text-sm">{timeAgo(time)}</span>
            </div>
            <p className="mb-4">{question}</p>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex space-x-4 mb-2 sm:mb-0">
                <span className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-1" />
                  {commentCount}
                </span>
                <span className="flex items-center">
                  <CirclePlus className="w-5 h-5 mr-1" />
                 {countPros}
                </span>
                <span className="flex items-center">
                  <CircleMinus className="w-5 h-5 mr-1" />
                  {countCons}
                </span>
              </div>
              <div className="flex space-x-4 mb-2 sm:mb-0">
              <Button variant="secondary"  className={`${countJoined>0?'':'hidden'}`}>Joined</Button>
              <Button variant="secondary" className="bg-blue-600 text-white"  onClick={()=>countJoined>0||yourpost?routeToDebateroom():handleShowCreate("joindebate")} >{countJoined>0||yourpost?"View":"Join"}</Button>
           
              </div>
            </div>
            <Choices 
            userid = {userid}
            postID={postID}
            question={question}
            pros={pros}
            cons={cons}
            />
          </div>
        )
      }
    