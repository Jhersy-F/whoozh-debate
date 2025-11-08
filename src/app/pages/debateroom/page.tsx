'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { MessageCircle, CirclePlus, CircleMinus} from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { styles } from '@/app/pages/style'
import { PostByID, countComment, countChoice, CommentByPostID, getPostByUserID, getAllJoinedByUserID } from "@/hooks/useFetchData"
import { useSearchParams  } from "next/navigation"
import  CommentCard  from "@/components/ui/comment"
import AddComment from  "@/components/ui/addComment"
import DebateList from "@/components/ui/debateList"
import { useSelector } from "react-redux"
import { RootState } from "@/GlobalRedux/store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { timeAgo } from "@/utils/dateCalculation"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
const DebateroomContent=() =>{


  const [isGreenActive,setisGreenActive] = useState(true);
  const [commentCount, setCommentCount] = useState(0);
  const [countPros, setcountPros] = useState(0);
  const [countCons, setcountCons] = useState(0);
  const changeActiveComments = ()=>{
    setisGreenActive(!isGreenActive);
  }
  
  const[posts, setPosts] = useState<PostType>();
  const[joined,setJoined] = useState<JoinedType[]>([]);
  const[yourPost, setYourpost] = useState<PostType[]>([]); 
  const[prosComments, setprosComments] = useState<CommentType[]>([]);
  const[consComments, setconsComments] = useState<CommentType[]>([]);
  const reload = useSelector((state:RootState) => state.commentModalSlice.reload);

  //const postID = params?.postID as string
  
  const SearchParams = useSearchParams();
  const postID = SearchParams?.get('postID');
  const router = useRouter();
  const {data:session,status} = useSession();
  const userID = session?.user?.id;

 useEffect(() => {
      if (status === 'loading') return; // Don't redirect while checking session
      if (!session) {
          router.push('/'); // Use router for client-side navigation
        }
}, [session, status, router]);

  const handleLeave = async() =>{
    try {
      const addUser = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              leaveDebate(
                postID: "${postID}", 
               
              ) {
                id
              
              }
            }
          `,
        }),
      });
      const result = await addUser.json();
      console.log(result)
      router.push(`/pages/debateroom?postID=${postID}`)
      return result;
    } catch (error) {
        return error;
    }
  
 
  }
  useEffect(() => {
  
    const getPosts = async () => {
    
      if(postID){

        const post = await PostByID(postID) as PostType;
      
        if(post){
          setPosts(post);
     
        }
       
        console.log(post)
        
   
        if(userID){
          const commentCount = await countComment(postID);
        setCommentCount(commentCount);

        const prosCount = await countChoice(postID,"pros");
        setcountPros(prosCount);

        const consCount = await countChoice(postID,"cons");
        setcountCons(consCount);

        const pros = await CommentByPostID(postID,"pros")
        setprosComments(pros)
   
        const cons = await CommentByPostID(postID,"cons")
        setconsComments(cons)
          const joinedList = await getAllJoinedByUserID(userID);
          setJoined(joinedList);
       
          const yourPostlist = await getPostByUserID(userID)
          setYourpost(yourPostlist);

        }
   
      }
      
    }
    
    getPosts();
   
  }, [userID,postID,reload]);
  return (

     
    <div className="bg-gray-900  text-white overflow-y-scroll">
      

        <div className="grid md:grid-cols-[250px_1fr]" key={posts?.id}>
          {/* Sidebar */}
          <div className="p-4 border-r border-gray-800">
            <h1 className="text-2xl font-bold mb-8">Debates</h1>
            
            <div className="space-y-6 ">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-400">Joined</h2>
                <div className="space-y-1">
                  {
                  
                 joined && joined.length > 0 && joined.map((joined:JoinedType)=>(
                    <DebateList
                    key = {joined.id}
                    content = {joined.post.content}
                    postID = {joined.post.id}
                    />
                  ))
                  
                }
                </div>
              </div>
  
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-400">Your Debates</h2>
                <div className="space-y-1">
                  {
                   yourPost && yourPost.length > 0 && yourPost.map((yourpost:PostType)=>(
                      <DebateList
                          key = {yourpost.id}
                          postID = {yourpost.id}
                          content= {yourpost.content}
                      />
  
                    ))
                  }
                 
                </div>
              </div>
              <div className="flex items-center p-0 m-0 "> 
                  {
                    userID !== posts?.user.id?<Button type="button" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-0 m-0 h-8 w-8" onClick={handleLeave}>
                    Leave
                  </Button>:<></>
                  }
              </div>
            </div>
          </div>
  
          {/* Main Content */}
          <div className="p-6 space-y-6 ">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt="Jhersy Fernandez" />
                <AvatarFallback>JF</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white">{`${posts?.user.firstname} ${posts?.user.lastname}`}</h2>
                <p className="text-sm text-gray-400">{timeAgo(posts ? posts.createdAt:"")}</p>
              </div>
            </div>
  
            {/* Question */}
            <div className="space-y-4 flex gap-2">
              <div className="flex flex-col gap-4  ">
                  <h1 className="text-2xl font-semibold text-wrap">
                    {`${posts?.content}`}
                  </h1>
                  
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>{commentCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CirclePlus className="h-4 w-4" />
                      <span>{countPros}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CirclePlus className="h-4 w-4" />
                      <span>{countCons}</span>
                    </div>
                
                  </div>
              </div>
              
          
            </div>
  
            {/* Yes/No Section */}
            <div className="grid lg:grid-cols-6  gap-px min-[320px]:grid-cols-4 md:grid-cols-4">
              <div className={`${isGreenActive?styles.greenCommentActive:""}  p-4 flex items-center gap-3 md:col-span-2 lg:col-span-2 min-[320px]:col-span-2 text-[#416F5F] lg:border-none`} onClick={isGreenActive?()=>{}:changeActiveComments}>
                <CirclePlus className="h-6 w-6  "/>
                <span className="text-xl font-bold ">{posts?.pros}</span>
              </div>
              <div className={`${!isGreenActive?styles.redCommentActive:""}  p-4 flex items-center gap-3 md:col-span-2 lg:col-span-2 min-[320px]:col-span-2 text-[#6F4141] lg:border-none`} onClick={!isGreenActive?()=>{}:changeActiveComments}>
                <CircleMinus className="h-6 w-6" />
                <span className= "text-xl font-bold ">{posts?.cons}</span>
              </div>
            </div>
  
            {/* Comments Section */}
            <div className="grid lg:grid-cols-6 gap-4 overflow-y-scroll h-[450px]">
              <div className = {`${isGreenActive?"":"md:hidden hidden"} lg:block space-y-4 md:col-span-4 lg:col-span-2 min-[320px]:col-span-4  h-full`} >
                {/* Green Comments */}
                {
                  prosComments && prosComments.length > 0 && prosComments.map((comment,index:number) =>(
                  
                      <CommentCard key = {index}
                        firstname = {comment.user.firstname}
                        lastname = {comment.user.lastname}
                        comment = {comment.comment}
                        time = {comment.createdAt}
                        commentID = {comment.id}
                        type = "pros"
                        userid ={posts?posts.user.id:""}
                        postID= {posts?posts.id:""}
                        audioUrl = {comment.audioUrl}
                        />
                
              
                  )
                )
              }
               </div>   
  
            
                <div className = {`${isGreenActive?"md:hidden hidden":""} lg:block space-y-4 md:col-span-4 lg:col-span-2 min-[320px]:col-span-4`} >
                      {
                            
                        consComments && consComments.length > 0 && consComments.map((comment,index:number) =>(
                        
                            <CommentCard key ={index}
                                firstname = {comment.user.firstname}
                                lastname = {comment.user.lastname}
                                comment = {comment.comment}
                                time = {comment.createdAt}
                                commentID = {comment.id}
                                type = "cons"
                                userid ={posts?posts.user.id:""}
                                postID= {posts?posts.id:""}
                                audioUrl = {comment.audioUrl}
                                />
                          
                          )    
                        )      
              
                      }
                </div>
              </div>
          
  
          
                    {
                    postID && 
                    <AddComment 
                      postID={postID} 
                      userid ={posts?posts.user.id:""}
                    />
                    }
              </div>
          </div>
       
     
    </div>

  )
}
export default function Debateroom() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DebateroomContent />
    </Suspense>
  )
}