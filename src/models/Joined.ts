import mongoose ,{Types} from 'mongoose'; // Default import
const { Schema, model, models, } = mongoose; // Destructure properties


export interface IJoined{
    userID:Types.ObjectId;
    postID:Types.ObjectId;
    choice:string;
    status:string;

}

const JoinedSchema = new Schema<IJoined>({
    userID:{type:Schema.Types.ObjectId, required:true, ref :'User'},
    postID:{type:Schema.Types.ObjectId, required:true, ref :'Post'},
    choice:{type:String, required:true},
    status:{type:String, required:true},

    }
,{timestamps:true});

const Joined = models?.Joined || model<IJoined>("Joined", JoinedSchema);

export default  Joined;