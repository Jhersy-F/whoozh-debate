import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '@/GlobalRedux/Features/showModalSlice';
import type { RootState } from '@/GlobalRedux/store'
import { useSession } from 'next-auth/react';
export default function Createdebate() {
  const [content, setContent] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const dispatch = useDispatch()
  const modalname = useSelector((state: RootState)=>state.modalSlice.modalname)
  const showModal = useSelector((state: RootState)=>state.modalSlice.showmodal)
  const [choice, setChoice] = useState('');
  let postID = '';
  const { data: session } = useSession();
  const userID = session?.user?.id;

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    // Handle form submission logic here
    //console.log(localStorage.getItem('userID'))
    const addPost = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query: `
              mutation {
                  addPost(
                      userID:"${userID}",
                      content: "${content}", 
                      pros: "${pros}", 
                      cons: "${cons}",
                    
                  ) {
                    id  
                    userID
                     content
                     pros
                     cons
                  }
              }
          `,
      }),
  });
  const result = await addPost.json()
  console.log(result)
  if (result.errors) {
    console.error('postID is required');
    console.log(result.errors);
  } else {
   // setMessage('User created successfully!');
   postID = result.data.addPost.id;
    console.log(postID);
  }
  if (!postID) {
    console.error('postID is required');
    console.log(result.errors);
    return; // Exit if userID is not provided
  }
  await fetch('/api/graphql', {
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
 
 
  dispatch(closeModal());
  }

  const handleCloseCreate = (e: React.FormEvent) =>{
    e.preventDefault()
    dispatch(closeModal());
  }
  const handleChoice = (choice:string) => {
    return() => {setChoice(choice)}
  }
 // handle closing the modal when clicking around it 
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (!target.closest('#modal')) {
      dispatch(closeModal());
    }
  }, [dispatch]);

  useEffect(() => {
    if(!showModal || modalname !== 'createdebate') return;
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showModal, modalname, handleOutsideClick]);

  return (
    <div className={`${showModal&&modalname==="createdebate"?"flex":"hidden"}  fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4`}>
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative " id = "modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Create Debate</h2>
          <button className="text-gray-400 hover:text-gray-200" aria-label="Close" onClick={handleCloseCreate}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Content here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 resize-none"
              rows={4}
            />
          </div>
          <div>
            <Input
              placeholder="Yes"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 mb-2"
            />
            <label className="text-sm text-gray-400">Pros</label>
          </div>
          <div>
            <Input
              placeholder="No"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 mb-2"
            />
            <label className="text-sm text-gray-400">Cons</label>
          </div>
          <div className="flex justify-between items-center mb-4">
          <h5 className="font-bold text-white">Please Choose</h5>
         
        </div>
        <div className="flex space-x-4">
            <Button type="button" className={`flex-1  ${choice==='pros'?'text-white bg-green-700 hover:text-white hover:bg-green-700':' bg-white  text-green-700'}`} onClick={handleChoice('pros')}>
              Pros
            </Button>
            <Button type="button" className={`flex-1  ${choice==='cons'?'text-white bg-red-600 hover:text-white hover:bg-red-600':' bg-white  text-red-600'}`} onClick={handleChoice('cons')}>
              Cons
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              Post
            </Button>
            {/*<Button type="button" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleCancel}>
              Cancel
            </Button>*/}
          </div>
        </form>
      </div>
    </div>
  )
}