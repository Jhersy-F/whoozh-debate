import mongoose ,{Types} from 'mongoose'; // Default import
const { Schema, model, models, } = mongoose; // Destructure properties

export interface IReply{
    userID:Types.ObjectId;
    commentID:Types.ObjectId;
    reply:string;
    
}

const ReplySchema = new Schema<IReply>({
    userID:{type:Schema.Types.ObjectId, required:true},
    commentID:{type:Schema.Types.ObjectId, required:true},
    reply:{type:String, required:true},

    }
,{timestamps:true});

const Reply = models?.Reply || model<IReply>("Reply", ReplySchema);

export default  Reply;