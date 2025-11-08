'use client'
import { Button } from "@/components/ui/button"
import { MessageCircle} from "lucide-react"
import { useRouter } from "next/navigation"
export default function DebateList({content,postID}:{content:string,postID:string}){
  const router = useRouter();
  const routeToDebateroom = ()=>{
    console.log("hi")
    router.push(`/pages/debateroom?postID=${postID}`)
  }

    return(
        <Button variant="ghost" className="w-full justify-start text-sm line-clamp-3" onClick = {routeToDebateroom}>
        <MessageCircle className="h-4 w-4 mr-2" />
        {content} 
        
      </Button>

    )
}