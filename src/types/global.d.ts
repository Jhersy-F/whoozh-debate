

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type ErrorResponse = ActionResponse<T> & { success: false };
type SuccessResponse<T> = ActionResponse<T> & { success: true };
interface UserType {
    id:string;
    firstname: string;
    lastname: string;
    email:string;
    avatar:string;
}
interface PostType { // Define the structure of a post object
    id: string;
    title: string;
    content: string;
    createdAt:string;
    pros:sttring;
    cons:string;
    user: UserType;
 
  }
  
  interface JoinedType { // Define the structure of joined data
    id: string;
    post:PostType
    
    // Add other joined properties
  }
  

    interface CommentType {
      comment: string;
      createdAt:string;
      type:string;
      id:string;
      audioUrl:string;
      user: UserType;
      
    }

    interface NotifType {
        id: string;
        description: string,
        is_seen: boolean,
        postID: string,
        createdAt: string,
        user:UserType
    }