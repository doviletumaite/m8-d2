import express from "express"
import createHttpError from "http-errors"
import postsModel from "./schema.js"
// import commentModel from "../comments/schema.js"
const postsRouter = express.Router()

postsRouter.get("/", async (req, res, next) => {
    try {
        const posts = await postsModel.find({}).populate({
            path: "author",
            select: "name surname avatar",
        })
        res.send(posts)
    } catch (error) {
        next(error)
    }
})

postsRouter.post("/", async (req, res, next) => {
    try {
        const newPost = new postsModel(req.body)
        const {_id} = await newPost.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})

postsRouter.get("/:id", async (req, res, next) => {
    try {
        const postID = req.params.id
        const post = await postsModel.findById(postID)
        if (post){
            res.send(post)
        } else {
            next(error)
        }
    } catch (error) {
        next(error)
    }
})
postsRouter.put("/:id", async (req, res, next) => {
    try {
        const postID = req.params.id  
        const modifiedPost = await postsModel.findByIdAndUpdate(postID, req.body, {
            new: true
        })
        if(modifiedPost){
            res.send(modifiedPost)
        } else {
            next(error)
        }
    } catch (error) {
        next(error)
    }
})
postsRouter.delete("/:id", async (req, res, next) => {
    try {
        const postID = req.params.id    
        const deletedPost = await postsModel.findByIdAndDelete(postID)
        if(deletedPost) {
            res.status(204).send()  
        } else {
         next(error)
        }
    } catch (error) {
        next(error)
    }
})

export default postsRouter