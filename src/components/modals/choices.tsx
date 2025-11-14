import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '@/GlobalRedux/Features/showModalSlice';
import type { RootState } from '@/GlobalRedux/store'
import { PostByID } from '@/hooks/useFetchData'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
export default function Choices({postID, question, pros, cons,userid }:{postID:string, question: string, pros: string, cons: string, userid:string}) {

  const dispatch = useDispatch()
  const router = useRouter();
 
 
  const modalname = useSelector((state: RootState)=>state.modalSlice.modalname)
  const showModal = useSelector((state: RootState)=>state.modalSlice.showmodal)
  const { data: session } = useSession();
  const userID = session?.user?.id;
  useEffect(()=>{

    const fetchPost = async (postID:string) => {
      const postbyID = await PostByID(postID);
      //setPost(postbyID) 
      console.log(postbyID)
    }
    fetchPost(postID);
  },[postID])
  const handleSubmit = async (e: React.FormEvent, choice:string) => {
    e.preventDefault()
    // Handle form submission logic here
    const joinDebate = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query: `
              mutation {
                      addJoined(
                      userID: "${userID}", 
                      postID: "${postID}", 
                      status:"active",
                      choice:"${choice}"
                   
                  ) {
                      id
                      userID
                      postID
                      status
                      choice
                      
                  }
                }
              
          `,
      }),
  });
  const is_seen = false
  const addNotif = await fetch('/api/graphql', 
    {    method: 'POST',
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
                    description:"Joined your Debate",
                    is_seen:${is_seen}
                 
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
  if(joinDebate && addNotif){
    router.push(`/pages/debateroom?postID=${postID}`)
  }
 //const notif =  await addNotif.json();
 //console.log(notif)
 dispatch(closeModal());
  }
  const handleCloseCreate = (e: React.FormEvent) =>{
    e.preventDefault()
    dispatch(closeModal());
  }

 // handle closing the modal when clicking around it 
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (!target.closest('#modal')) {
      dispatch(closeModal());
    }
  }, [dispatch]);

  useEffect(() => {
    if(!showModal || modalname !== "joindebate") return;
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showModal, modalname, handleOutsideClick]);

  return (
    <div className={`${showModal&&modalname==="joindebate"?"flex":"hidden"}  fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50`}>
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative " id = "modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Please Choose</h2>
          <button className="text-gray-400 hover:text-gray-200" aria-label="Close" onClick={handleCloseCreate}>
            <X size={24} />
          </button>
        </div>
        <form  className="space-y-4">
          <div>
          <h3 className=" font-bold text-white">{question}</h3>
          </div>
       
        
          <div className="flex space-x-4">
            <Button type="button" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={(e)=>handleSubmit(e,"pros")}>
              {pros}
            </Button>
            <Button type="button" className="flex-1 bg-red-600 hover:bg-red-700
             text-white" onClick={(e)=>handleSubmit(e,"cons")}>
              {cons}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}