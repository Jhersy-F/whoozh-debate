'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { getJoinedByUserID } from "@/hooks/useFetchData"
import { useDispatch, useSelector } from "react-redux"
import { setReload, setLoading } from "@/GlobalRedux/Features/commentModalSlice"
import { RootState } from "@/GlobalRedux/store"
import { useSession } from "next-auth/react"
export default function AddComment({postID,userid}:{postID:string,userid:string}){
    //const [commentText,setCommentText] = useState('')
    const { data: session } = useSession();
    const userID = session?.user?.id || null;
    const [text, setText] = useState<string>('');
    const [choice, setChoice] = useState('')

    const dispatch = useDispatch()
    const [error, setError] = useState<string | null>(null);
    const loading = useSelector((state:RootState) => state.commentModalSlice.loading);

    useEffect( ()=>{
          const fetchData = async () => {
            if(userID){
              const joined = await getJoinedByUserID(userID, postID);
              setChoice(joined?.choice ?? null);
            }
           
      
          }

          fetchData()

    },[text, userID, postID])

    /*const handleGenerate = async () => {
      const response = await fetch('/api/playht', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // Corrected line
    });

    const data = await response.json();
    if (data.audioUrl) {}
    console.log(data);
  };*/
 const genrateAudio = async () => {
      
   
        setError(null);

        try {
         
            const response = await fetch('/api/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }

            const data = await response.json();
            //setAudioUrl(data.audioUrl);
            return data
           
        } catch (err: unknown) {
            // Using 'any' for error, you can define a more specific type if needed
            console.error('Error:', err);
            setError('Error generating audio. Please try again.');
            return error
        } 
      
    };
    const handleComment = async() =>{
      const data = await genrateAudio();
      const audioUrl = data ? data.audioUrl : "";
       console.log(data);
       dispatch(setLoading(true))
    
        const addComment = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              query: `
                  mutation {
                  mutation AddComment(
                      $userID: ID, 
                      $postID: ID!, 
                      $comment: String!, 
                      $type: String,
                      $audioUrl: String
                  ) {
                      addComment(
                          userID: "${userID}", 
                          postID: "${postID}", 
                          comment: "${text}", 
                          type: "${choice}",
                          audioUrl: "${audioUrl}"
                      
                          userID: $userID, 
                          postID: $postID, 
                          comment: $comment, 
                          type: $type,
                          audioUrl: $audioUrl
                      ) {
                          id
                          userID
                          postID
                          comment
                          type
                          audioUrl
                      }
                  }
              `,
              variables: {
                userID,
                postID,
                comment: text,
                type: choice,
                audioUrl
              }
          }),
      });
       const result = await addComment.json();
       console.log(result)
       if(result){
        dispatch(setReload(true))
        dispatch(setLoading(false))
        setText("")
       }
      await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                        addNotification(
                        recipientID: "${userID}",
                        initiatorID:"${userid}", 
                        postID: "${postID}", 
                        description:"Commented to your Debate",
                        is_seen:false
                     
                    ) {
                        id
                        recipientID
                        initiatorID
                        postID
                        description
                        is_seen
                        
                    }
                mutation AddNotification(
                    $recipientID: ID,
                    $initiatorID: ID!,
                    $postID: ID!,
                    $description: String!,
                    $is_seen: Boolean!
                ) {
                    addNotification(
                    recipientID: $recipientID,
                    initiatorID: $initiatorID, 
                    postID: $postID, 
                    description: $description,
                    is_seen: $is_seen
                 ) {
                    id
                  }
                
                }
            `,
            variables: {
                recipientID: userID,
                initiatorID: userid,
                postID: postID,
                description: "Commented to your Debate",
                is_seen: false
            }
        }),
    });

     
      
      }
    return (
        <div className=" grid grid-cols-6">
            <div className="md:col-span-4 col-span-6 relative">

              <Input 
                placeholder="Comment Here" 
                className="bg-gray-200 text-gray-900 border-0 pr-12"
                onChange={(e)=>{setText(e.target.value)}}
                value={loading?"Sending":text}
              />
               <Button 
              size="sm" 
              className="absolute right-1 top-1 p-1"
              variant="ghost"
              onClick={handleComment}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-blue-500"
              >
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            </div>
           
           
          </div>
    )
}