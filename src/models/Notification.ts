import mongoose ,{Types} from 'mongoose'; // Default import
const { Schema, model, models, } = mongoose; // Destructure properties

export interface Inotification{
    recipientID:Types.ObjectId,
    initiatorID:Types.ObjectId,
    postID:Types.ObjectId,
    is_seen:boolean,
    description: string,
   

}

const NotificationSchema = new Schema<Inotification>({
    recipientID:{type:Schema.Types.ObjectId, required:true,ref:'User'},
    initiatorID:{type:Schema.Types.ObjectId, required:true,ref:'User'},
    postID:{type:Schema.Types.ObjectId,required:true,ref:'Post'},
    description:{type:String},
    is_seen:{type:Boolean}
},{timestamps:true})

const Notification = models.Notification || model<Inotification>("Notification",NotificationSchema);

export default Notification;

