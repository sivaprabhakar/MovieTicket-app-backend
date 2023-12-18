import mongoose from "./index.js";


const validateEmail = (e)=>{
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(e); 
}

const userSchema = new mongoose.Schema({
    name:{type:String,
        required:[true,"Name is required"]},
    
    email:{type:String,
        required:[true,"Email is required"],
        validate:validateEmail},
    password:{type:String,
        required:[true,"Password is required"]},

    bookings : [{ type: mongoose.Types.ObjectId, 
        ref: "Booking" }],
},
   
{
    collection:'users',
    versionKey:false
})

const userModel = mongoose.model('users',userSchema)
export default userModel