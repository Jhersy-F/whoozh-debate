'use client'

import React, { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"

import {countComment} from "@/hooks/useFetchData"
export default function CommentCount({ postID }: { postID: string;}) {
  const [commentCount, setCommentCount] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      const count = await countComment(postID);
      setCommentCount(count);

      
    }
    fetchData()
  }, [postID]);
        return (
          
                <span className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-1" />
                 {commentCount}
                </span>
             
               
        )
      }
    