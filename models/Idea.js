//数据模型

//引入mongoose
const  mongoose=require('mongoose');

//设计属性
const Schema=mongoose.Schema;

const  IdeaSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

mongoose.model('ideas',IdeaSchema)