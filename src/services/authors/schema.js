import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose
export  const authorsSchema = new Schema({
     name: {type: String, required: true},
     surname: {type: String, required: true},
     country: {type: String, required: true},
     bio: {type: String, required: true},
     password:{type: String, required: true},
     posts: {type: Schema.Types.ObjectId, ref: "posts"}
    },
    {
        timestamps:true
    })

    // hash password
    authorsSchema.pre("save", async function (next){
        const newAuthor = this
        const plainPW = newAuthor.password
        if(newAuthor.isModified("password")){
              newAuthor.password = await bcrypt.hash(plainPW, 11) 
        }
        next()
    })

    // for every res.send
    authorsSchema.methods.toJSON = function(){ 
    const author = this
    const authorObj = author.toObject()
    delete authorObj.password
    delete authorObj.__v
    return authorObj
    }

    authorsSchema.static.checkCredential  = function(name, password){

    }
export default model( "author", authorsSchema)