const mongoose=require('mongoose')
const validator=require('validator')

const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,
        required:true,
        validator:(value)=>{
            return validator.isEmail(value)
        }
    },
    mobile:{type:String,default:'000-000-0000'},
    password:{type:String,required:true},
    role:{type:String,default:'user'},
    createdAt:{type:Date,default:Date.now}
},
{
    collection:'user',
    versionKey:false
}
)

let UserModel=mongoose.model('user',userSchema)
module.exports={UserModel}