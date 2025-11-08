const getAllPost  = async (userID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
              getAllPost(userID: "${userID}"){
                id
                content
                pros
                cons
                createdAt
                user {
                  id
                  firstname
                  lastname
                  email
                  avatar
                }
              }
            }
        `,
      }),
    });
   
    const result = await response.json();
    console.log(result)
    if (result.data) {
     return result.data.getAllPost;
    }
  };
  const countChoice  = async (postID:string,choice:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               countChoice(postID: "${postID}",choice:"${choice}")
            }
        `,
      }),
    });
   
    const result = await response.json();
 
    if (result.data) {
        return result.data.countChoice
    }
 
  };
  const countComment  = async (postID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               countComment(postID: "${postID}")
            }
        `,
      }),
    });
   
    const result = await response.json();
   
    if (result.data) {
        return result.data.countComment
    }
 
  };
  const getCountReaction = async (commentID:string,type:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               countReaction(commentID: "${commentID}", reactionType:"${type}")
            }
        `,
      }),
    });
   
    const result = await response.json();
    if (result.data) {
        return result.data.countReaction
    }
 
  };
  const PostByID  = async (postID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
     query {
          getPostByID(id: "${postID}") {
            id
            content
            pros
            cons
            createdAt
            user {
              id
              firstname
              lastname
              email
              avatar
            }
          }
      }
        `,
      }),
    });
   
    const result = await response.json();
 
    if (result.data) {
        return result.data.getPostByID
    }
 
  };
  const searchPostsByContent  = async (searchTerm:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
     query {
          searchPostsByContent(content: "${searchTerm}") {
            id
            content
            pros
            cons
            createdAt
            user {
              id
              firstname
              lastname
              email
              avatar
            }
          }
      }
        `,
      }),
    });
   
    const result = await response.json();
 
    if (result.data) {
        return result.data.searchPostsByContent
    }
 
  };
  const TopPosts  = async () => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               getTopPosts {
                    id
                    count
                    content
                    pros
                    cons
                    createdAt
                    user{
                      id
                      firstname
                      lastname
                    }
                   
                  }
            }
        `,
      }),
    });
   
    const result = await response.json();

    if (result.data) {
        return result.data.getTopPosts
    }
 
  };
  const getcountJoined  = async (postID:string,userID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               countJoined(postID: "${postID}", userID: "${userID}") 
            }
        `,
      }),
    });
   
    const result = await response.json();

    if (result.data) {
        return result.data.countJoined
    }
 
  };
  const getJoinedByUserID  = async (userID:string, postID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               getJoinedByUserID(userID: "${userID}", postID: "${postID}") 
               {
                  id
                  userID
                  postID
                  choice
               }
            }
        `,
      }),
    });
   
    const result = await response.json();
 
    if (result.data) {
        return result.data.getJoinedByUserID
    }
 
  };
  const getAllJoinedByUserID  = async (userID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               getAllJoinedByUserID(userID: "${userID}") 
               {
                  id
                  post{
                    id
                    content
                    createdAt
                    updatedAt
                    user {
                        id
                        firstname
                        lastname
                        email
                        avatar
                        
                      }
                  }
              
               }
            }
        `,
      }),
    });
   
    const result = await response.json();
    console.log(result)
    if (result.data) {
        return result.data.getAllJoinedByUserID
    }
 
  };
  const getPostByUserID  = async (userID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
       query {
               getPostByUserID(userID: "${userID}") 
               {
                  id
                  content
                  createdAt
                  updatedAt
                     user {
                        id
                        firstname
                        lastname
                        email
                        avatar
                      }
               }
            }
        `,
      }),
    });
   
    const result = await response.json();
    console.log(result)
    if (result.data) {
        return result.data.getPostByUserID
    }
 
  };
  const CommentByPostID  = async (postID:string,type:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
     query {
          getCommentByPostID(postID: "${postID}",type: "${type}") {
            id
            postID
            comment
            type
            audioUrl
            createdAt
            user {
              id
              firstname
              lastname
              email
              avatar
            }
          }
      }
        `,
      }),
    });
   
    const result = await response.json();
    console.log(result)
    if (result.data) {

        return result.data.getCommentByPostID
    }
 
  };
  const getReactionByUserID  = async (commentID:string,userID:string) => {

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        query: `
     query {
          getReactionByUserID(commentID: "${commentID}",userID: "${userID}") 
          {
            id
            reactionType
          }
          
      }
        `,
      }),
    });
   
    const result = await response.json();
   
    if (result.data) {
  
        return result.data.getReactionByUserID
    }
 
  };
  const getNotificationByUser = async (userID: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              getNotificationByUser(userID: "${userID}") {
                notification {
                  id
                  description
                  is_seen
                  postID
                  createdAt
                  user {
                    id
                    firstname
                    lastname
                    email
                    avatar
                  }
                }
                totalCount
              }
            }
          `,
        }),
      });
   
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Notification fetch result:', result);
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'GraphQL error occurred');
      }
      
      if (result.data && result.data.getNotificationByUser) {
        return result.data.getNotificationByUser;
      } else {
        console.warn('No notification data received');
        return { notification: [], totalCount: 0 };
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };
  export {countChoice, getAllPost, countComment, TopPosts, PostByID, getcountJoined, CommentByPostID, getCountReaction, getReactionByUserID, getJoinedByUserID, getPostByUserID, getAllJoinedByUserID, getNotificationByUser, searchPostsByContent}