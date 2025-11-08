import mongoose from 'mongoose'; // Default import
const { Schema, model, models } = mongoose; // Destructure properties

export interface IUser{
    email:string;
    firstname:string;
    lastname:string;
    location?:string;
    work?:string;
    contact?:string;
    avatar?:string
    
}

const UserSchema = new Schema<IUser>({
    email:{type:String, required:true, unique:true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    location:{type:String},
    work:{type:String},
    contact:{type:String},
    avatar:{type:String}
    }
,{timestamps:true});

const User = models?.User || model<IUser>("User", UserSchema);

export default  User;