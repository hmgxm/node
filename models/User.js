//数据模型

//引入mongoose
const  mongoose=require('mongoose');

//设计属性
const Schema=mongoose.Schema;

const  UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

mongoose.model('users',UserSchema)