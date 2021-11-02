import mongoose from "mongoose"
import { commentsSchema } from "../comments/schema.js"
const { Schema, model } = mongoose


const postSchema = new Schema(
    {
      category: {type: String, required: true },
      title: {type: String, required: true},
      cover: {type:String, required: true},
      readTime: {
          value: {type: Number, required: true},
          unit: { type: String, required: true}
      },
      author: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: "author"
      },
      content: {type: String, required: true},
      comments: [commentsSchema]
    },
    {
        timestamps: true,
    }
)

export default model("post", postSchema)


