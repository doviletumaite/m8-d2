import mongoose from "mongoose"

const { Schema, model } = mongoose
export  const authorsSchema = new Schema({
     name: {type: String, required: true},
     surname: {type: String, required: true},
     country: {type: String, required: true},
     bio: {type: String, required: true},
     posts: {type: Schema.Types.ObjectId, ref: "posts", required: true}
    },
    {
        timestamps:true
    })
export default model( "author", authorsSchema)