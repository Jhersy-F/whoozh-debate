'use client'
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { showModal } from "@/GlobalRedux/Features/showModalSlice";

import { useDispatch } from "react-redux"
import { useEffect } from "react"
import DebateCard  from "@/components/ui/debatecard"
import {  getPostByUserID, getAllJoinedByUserID, TopPosts } from "@/hooks/useFetchData"
import TrendingDebate from "@/components/ui/trendingdebate"
import { useSession } from "next-auth/react";
export default function Homepage() {
  const {data:session} = useSession();
  const userID = session?.user?.id;
  const dispatch = useDispatch();
  const [active,Setactive] = useState("yourdebate")
  const[joined,setJoined] = useState<JoinedType[]>([]);
  const[yourPost, setYourpost] = useState<PostType[]>([]); 

  const[topPosts,setTopPosts] = useState<PostType[]>([]);
  const handleShowCreate = (modalname:string)=>{
    dispatch(showModal({modalname:modalname}));
    
  }
  const handleClick = (button:string)=>{
    Setactive(button);
  }

 
  useEffect(() => {
    const fetchData = async () => {
      if(userID){
        const joinedList = await getAllJoinedByUserID(userID);
        setJoined(joinedList);
        const yourPostlist = await getPostByUserID(userID)
        setYourpost(yourPostlist);
        console.log(yourPostlist)
      }
    
    
    }
    const getTopPosts = async () => {
      const top = await TopPosts();
      setTopPosts(top);
 
    }
    
    
    fetchData()
    getTopPosts()

  }, [userID]);
  return (
    <div className="flex bg-gray-900 text-white ">
   
      <div className="container mx-auto mt-20 px-4 md:px-0 md:h-full  lg:h-screen">
        <div className="grid lg:grid-cols-7 md:grid-cols-3 gap-6 md:p-3">
          <div className="md:col-span-2 space-y-6 lg:col-span-3 lg:col-start-2 lg:col-end-5">
          <div className="flex items-center space-x-4 ">
                <Button className={`${active==="yourdebate"?"border-blue-600 text-blue-600":"border-white-60"}  flex-grow bg-gray-900 hover:bg-blue-700 border-b-4 rounded-none text-lg font-semibold`} onClick={()=>handleClick("yourdebate")}>Your Debate</Button>
                <Button className={`${active==="joined"?"border-blue-600 text-blue-600":"border-white-60"}  flex-grow bg-gray-900 hover:bg-blue-700 border-b-4 rounded-none text-lg font-semibold`} onClick={()=>handleClick("joined")}>Joined</Button>
            </div>
            <div className="flex items-center space-x-4 ">
              <Avatar className="w-12 h-12 ">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button className="flex-grow bg-blue-600 hover:bg-blue-700" onClick={()=>handleShowCreate("createdebate")}>Create New</Button>
            </div>
                {
                  active==="joined"?
                    <>
                      {
                       joined && joined.length > 0 && joined.map(joined => (

                          <DebateCard
                            key={joined.id}
                            user={`${joined.post.user.firstname} ${joined.post.user.lastname}`}
                            time={joined.post.createdAt} // Format the date
                            question={joined.post.content}
                            postID={joined.post.id}
                            pros={joined.post.pros}
                            cons={joined.post.cons}
                            userid={joined.post.user.id}
                          />
                          ))
                        }
                    </>:
                    <>
                       {
                        yourPost && yourPost.length > 0 && yourPost.map(yourPost => (

                          <DebateCard
                            key={yourPost.id}
                            user={`${yourPost.user.firstname} ${yourPost.user.lastname}`}
                            time={yourPost.createdAt} // Format the date
                            question={yourPost.content}
                            postID={yourPost.id}
                            pros={yourPost.pros}
                            cons={yourPost.cons}
                            yourpost={true}
                            userid={yourPost.user.id}
                          />
                        ))
                        }
                    </>
                }
                
          </div>

              <div className="bg-gray-800 p-4 rounded-lg lg:col-span-2 lg:col-start-5 h-fit">
                      <h2 className="text-xl font-bold mb-4">Trends</h2>
                      <div className="space-y-4">
                        {
                        topPosts &&  topPosts.map(post => (
                            <TrendingDebate
                            key={post.id}
                            postID={post.id}
                            user={`${post.user.firstname} ${post.user.lastname}`}
                            time={post.createdAt} 
                            question={post.content}
                          
                          />
                          ))
                        }
                       
                       
                       
                      </div>
                      
                    </div>
        </div>
      </div>
    </div>
  )
}


