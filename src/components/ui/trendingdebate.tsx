'use client'
import React, { useState, useEffect } from "react"
import { MessageSquare, CirclePlus, CircleMinus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {countComment,countChoice} from "@/hooks/useFetchData"
export default function TrendingDebate({ user, time, question, postID }: { user: string; time: string; question: string; postID: string }) {
  const [commentCount, setCommentCount] = useState(0);
  const [countPros, setcountPros] = useState(0);
  const [countCons, setcountCons] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const commentCount = await countComment(postID);
      setCommentCount(commentCount);

      const prosCount = await countChoice(postID,"pros");
      setcountPros(prosCount);

      const consCount = await countChoice(postID,"cons");
      setcountCons(consCount);
    }
    fetchData()
    }, [postID]);
    function timeAgo(dateString: string): string {
      const now = new Date();
      const postDate = new Date(Number(dateString));
      const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;
      
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;
      
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;
      
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
      
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
      console.log(postDate);
      return "just now";
  }
    return (
      <div className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" alt={user} />
            <AvatarFallback>{user[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <span className="font-semibold md:text-xs lg:text-base">{user}</span>
            <span className="text-gray-400 lg:text-sm md:text-xs sm:text-xs">{timeAgo(time)}</span>
          </div>
        </div>
        <p className="mb-2 lg:text-sm md:text-sm">{question}</p>
        <div className="flex space-x-4 lg:text-sm md:text-sm">
          <span className="flex items-center ">
            <MessageSquare className="w-4 h-4 mr-1" />
            {commentCount}
          </span>
          <span className="flex items-center">
            <CirclePlus className="w-4 h-4 mr-1" />
            {countPros}
          </span>
          <span className="flex items-center">
            <CircleMinus className="w-4 h-4 mr-1" />
            {countCons}
          </span>
        </div>
  
      </div>
    )
  }