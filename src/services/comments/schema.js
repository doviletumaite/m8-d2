import mongoose from "mongoose"

const { Schema, model } = mongoose
export  const commentsSchema = new Schema({
    text: {type:String}
    },
    {
        timestamps:true
    })
export default model( "comment", commentsSchema)