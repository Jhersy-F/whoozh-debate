'use client'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import React, { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"

import { Card } from "@/components/ui/card"

import { timeAgo } from "@/utils/dateCalculation"
import { getCountReaction, getReactionByUserID } from "@/hooks/useFetchData";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import AudioPlayer from "./audioPlayer"
import { useSession } from "next-auth/react"

export default function CommentCard({ firstname, lastname, comment, time, commentID, type, userid, postID, audioUrl }: { firstname: string; lastname: string; comment: string, time: string,  commentID: string, type:string, userid:string, postID:string, audioUrl:string }) {
  

 
  const[countLike, setCountLike] = useState(0);
  const[countDislike, setCountDislike] = useState(0);
  const[userReaction, setUserReaction] = useState<any>(null);
  const[reaction, setReaction] = useState<string|unknown>("");
  const { data: session } = useSession();
  const userID = session?.user?.id || null;
  useEffect(() => {
    const fetchData = async () => {
   
        const Likes = await getCountReaction(commentID,"LIKE");
        setCountLike(Likes);

        const DisLikes = await getCountReaction(commentID,"DISLIKE");
        setCountDislike(DisLikes);
        if(userID){
          const react = await getReactionByUserID(commentID,userID);
          setUserReaction(react);
          if(react!==null){
            setReaction(react.reactionType)
          }
        }
      
    }
    fetchData()
    }, [commentID, userID]);

   

    
 

     
        const handleReaction = async (type:string) => {
          setReaction(type);
          let result = [];
          await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation {
                            addNotification(
                            recipientID: "${userid}",
                            initiatorID:"${userID}", 
                            postID: "${postID}", 
                            description:"Reacted to your Comment",
                            is_seen:false
                         
                        ) {
                            id
                            recipientID
                            initiatorID
                            postID
                            description
                            is_seen
                            
                        }
                      }
                    
                `,
            }),
        });
          if(userReaction==null){
            const addReaction = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  query: `
                      mutation {
                          addReaction(
                              userID: "${userID}", 
                              commentID: "${commentID}", 
                              reactionType: "${type}",
                          
                          
                          ) {
                              id
                              userID
                              commentID
                              reactionType
                            
                          }
                      }
                  `,
              }),
          });
           result = await addReaction.json();
           
          }
          else{
           const updateReaction = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  query: `
                      mutation UpdateReaction($userID: ID!, $commentID: ID!, $reactionType: String!) {
                          updateReaction(
                              userID: $userID, 
                              commentID: $commentID, 
                              reactionType: $reactionType,
                          
                          
                          ) {
                              id
                              userID
                              commentID
                              reactionType
                            
                          }
                      }
                  `,
                   variables: {
                   userID,
                   commentID,
                   reactionType: type
                 }
              }),
          });
           result = await updateReaction.json();
          }
        
        
        console.log(result);
          // Handle form submission logic here
        }
        return (
            <Card className={`${type=="pros"?"bg-gray-900 border-1 border-[#00783E] border-solid":" bg-gray-900 border-1 border-[#6F4141] border-solid"} flex flex-col card-modern p-6 rounded-2xl border transition-all duration-300`}>
            <div className=" space-y-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Jhersy Fernandez" />
                  <AvatarFallback>JF</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{`${firstname} ${lastname}`}</span>
                  <span className="text-xs text-gray-400">{timeAgo(time)}</span>
                </div>
              </div>
              <p className="text-sm text-white flex-1">
                {comment}
              </p>
              <AudioPlayer audio={audioUrl}/>
              
              <div className="flex items-center space-x-2 mt-2 text-white">
              
                  {
                   reaction==="LIKE"?<AiFillLike className={`mr-1 h-4 w-4 cursor-pointer`} onClick = {()=>handleReaction("LIKE")}/>:<ThumbsUp className={`mr-1 h-4 w-4 cursor-pointer`} onClick = {()=>handleReaction("LIKE")}/>
                    
                    
                  }
                  <span>{countLike}</span>
               
             
                 
                  {

                  reaction==="DISLIKE"?<BiSolidDislike className={`mr-1 h-4 w-4 cursor-pointer`} onClick = {()=>handleReaction("DISLIKE")}/>:<ThumbsDown className={`mr-1 h-4 w-4 cursor-pointer`}  onClick = {()=>handleReaction("DISLIKE")}/>
                  
                  
                  }
                  <span>{countDislike}</span>
              
              </div>
            </div>
            
          </Card>
        )
      }
    