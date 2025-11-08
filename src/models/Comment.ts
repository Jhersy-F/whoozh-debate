import mongoose ,{Types} from 'mongoose'; // Default import
const { Schema, model, models, } = mongoose; // Destructure properties


export interface IComment{
    userID:Types.ObjectId;
    postID:Types.ObjectId;
    comment:string;
    type:string;
    audioUrl:string;
}

const CommentSchema = new Schema<IComment>({
    userID:{ type:Schema.Types.ObjectId, required:true, ref: 'User'},
    postID:{ type:Schema.Types.ObjectId, required:true},
    comment:{type:String, required:true},
    type:{type:String, required:true},
    audioUrl:{type:String},

    }
,{timestamps:true});

const Comment = models?.Comment || model<IComment>("Comment", CommentSchema);

export default  Comment;