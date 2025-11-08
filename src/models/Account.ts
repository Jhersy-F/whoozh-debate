

import mongoose ,{Types} from 'mongoose'; // Default import
const { Schema, model, models, } = mongoose; // Destructure properties

export interface IAccount{
    userID:Types.ObjectId;
    provider:string;
    providerAccountID:string;
    password?:string;
    image?:string;
    
}

const AccountSchema = new Schema<IAccount>({
    userID:{ type: Schema.Types.ObjectId, required: true, ref: 'User ' },
    provider:{type:String}, 
    providerAccountID:{type:String},
    password:{type:String, required:true},
    image:{type:String}
        
},{timestamps:true});

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default  Account;