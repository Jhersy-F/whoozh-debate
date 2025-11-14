// graphql/schema.ts
import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type User {
    id: ID!
    firstname: String!
    lastname:String!
    email: String!
    location: String
    work: String
    contact: String
    avatar:String
    createdAt: String
    updatedAt: String
   
  }

  type PaginatedUsers {
    users: [User!]!
    totalCount: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
  
  type Account{
    id: ID!
    userID: ID!
    provider: String
    providerAccountID: String
    password: String
    image: String
    createdAt: String
    updatedAt: String
    user:User
  }

   type Post{
    id: ID!
    userID: String!
    user:User
    content: String!
    pros: String!
    cons: String!
    createdAt: String
    updatedAt: String
  }
    
 type Comment{
    id: ID!
    userID: ID!
    comment: String!
    postID: ID!
    user: User!
    type: String!
    audioUrl: String!
    createdAt: String
    updatedAt: String
  }

 type Reply{
    id: ID!
    userID: String!
    reply: String!
    commentID: String!
    createdAt: String
    updatedAt: String
  }

 type Reaction{
    id: ID!
    userID: String!
    commentID: String!
    reactionType:String!
    createdAt: String
    updatedAt: String
  }

 type Joined{
    id: ID!
    userID: ID!
    postID: ID!
    choice:String!
    status:String!
    createdAt: String
    updatedAt: String
    post:Post!
    user:User!
  }

type Choice{
    id: ID!
    userID: String!
    postID: String
    choice: String
    createdAt: String
    updatedAt: String
  }
type Notification{
  id:ID!
  postID:String!
  recipientID:String!
  initiatorID:String!
  is_seen:Boolean!
  description:String!
  user:User!
  createdAt: String
  updatedAt: String
}
type NotificationCount{
  notification:[Notification!]!
  totalCount:Int!
}

 type TopChoice {
    id: String!
    count: Int!
    content: String!  
    pros: String!      
    cons: String!    
    createdAt: String
    user: User! 
  }
  type Query {
    getUsers(page: Int, limit: Int): PaginatedUsers!
    getUserByID(id:String!) :User
    getAccountByID(userID:String!): Account
    getAllPost(userID:String!): [Post!]!
    getPostByID(id:ID!): Post!
    getCommentByPostID(postID:ID!, type: String!): [Comment!]!
    getReplyByCommentID: [Reply!]
    getPostByUserID(userID:ID!): [Post!]!
    getJoinedByUserID(userID:ID!,postID:ID!):Joined
    getAllJoinedByUserID(userID:ID!):[Joined!]!
  
    countChoice(choice:String,postID:String):Int
    countComment(postID:String):Int
    getTopPosts: [TopChoice!]!
    countJoined(postID:String,userID:String): Int
    countReaction(commentID:String,reactionType:String): Int
    getReactionByUserID(commentID:String,userID:String): Reaction
    getNotificationByUser(userID:String): NotificationCount!
    searchPostsByContent(content:String!) : [Post!]!
  }

  type Mutation {
    login(email: String!,password: String!) :User
    addUser (firstname: String!,lastname:String!, email: String!): User!
    addAccount (userID: ID!, provider: String, providerAccountID: String, password: String, image: String): Account
    addPost(userID:String!, content:String!, pros:String!, cons:String!): Post 
    addComment(userID:ID!,postID:ID!, comment:String!, type:String!, audioUrl:String!): Comment
    addChoice(userID:String!,postID:String!, choice:String!): Choice
    addJoined(userID:String!,postID:String!, choice:String!, status:String!): Joined
    addReaction(userID:String!,commentID:String!,reactionType:String): Reaction
    updateReaction(userID:String!,commentID:String!,reactionType:String): Reaction
    addNotification(postID:String!,initiatorID:String!,recipientID:String!,is_seen:Boolean!,description:String!): Notification
    updateNotif(id:String!, is_seen:Boolean!): Notification
    updateProfile(id:String!, firstname: String!,lastname:String, location:String, work:String, contact:String): User
    updatePhoto(id:String!, avatar:String): User!
    leaveDebate(postID:String!): Joined
    resetPassword(userID:String!,password:String!) :Account
  }
`;

export default typeDefs;