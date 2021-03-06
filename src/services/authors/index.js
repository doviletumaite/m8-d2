import express from "express"
import createHttpError from "http-errors"
import { AdminOnly } from "../authorization/admin.js"
import { authorization } from "../authorization/basic.js"
import { JWTAuthenticate, JwtMiddlewareCheck, verifyRefreshAndGenerate } from "../authorization/tools.js"
import postsModel from "../posts/schema.js"
import authorsModel from "./schema.js"
const authorsRouter = express.Router()

authorsRouter.post("/", async (req,res, next) => {
    try {
        const newAuthor = new authorsModel(req.body)
        const author = await newAuthor.save()
        res.send(author)
    } catch (error) {
        next(error)  
    }
})

// ******** Authentication ************
authorsRouter.post("/login", async(req, res, next) => {
    try {
        console.log("path", req.body)
        const {name, password} = req.body
        const author = await authorsModel.checkCredentials(name, password)
        console.log("author",author )
        if (author){
            console.log("author if",author )  
         const {accessToken, refreshToken} = await JWTAuthenticate(author)
         console.log("token",accessToken,refreshToken )
         res.send({accessToken, refreshToken})
        } else {
            next(createHttpError(401, `credentials not ok`))  
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/refreshToken", async (req, res, next) =>{
    try {
        const {currentRefreshToken} = req.body
       
        const {accessToken, refreshToken} = await verifyRefreshAndGenerate(currentRefreshToken)
         console.log(currentRefreshToken)
        res.send({accessToken, refreshToken})
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/logout", async (req, res, next) =>{
    try {
       req.author.refreshToken = null
       await req.user.save()
       res.send()
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/me", authorization, async (req, res, next) => {
    try {
        res.send(req.author)
        console.log(req.author)
    } catch (error) {
        next(createHttpError(404, `not found`)) 
    }
})
authorsRouter.put("/me", authorization, async (req,res, next) => {
    try {
        req.author.body= {...req.body}
        const newAuthor = await req.author.save()
        res.send(newAuthor)
    } catch (error) {
        next(error) 
    }
})
authorsRouter.delete("/me", authorization, AdminOnly, async (req,res, next) => {
    try {
        await req.author.deleteOne()
        res.send("ok")
    } catch (error) {
        next(error) 
    }
})

authorsRouter.get("/me/stories", JwtMiddlewareCheck, async (req, res, next) => {
    try {
        const posts = await postsModel.find({author: req.author._id.toString()})
        res.status(200).send(posts)
    } catch (error) {
        next(createHttpError(404, `not found`)) 
    }
})


// *******************************************************************************************

authorsRouter.get("/", async (req,res, next) => {
    try {
        const authors = await authorsModel.find()
        res.send(authors)
    } catch (error) {
        next(error) 
    }
})

authorsRouter.get("/:id", async (req,res, next) => {
    try {
        const author = await authorsModel.findById(req.params.id)
        if(author){
            res.send(author)
        } else {
            next(createHttpError(404, `Author with id ${req.params.id} doesn't exist`))
        }
    } catch (error) {
        next(error)
    }
})
authorsRouter.delete("/:id", async (req,res, next) => {
    try {
        const author = await authorsModel.findById(req.params.id) 
        const deletedAuthor = await authorsModel.findByIdAndDelete(author)
        if (deletedAuthor) {
            res.status(204).send({message:`it's successfully deleted`})
        } else {
            next(createHttpError(404,`Author with id ${req.params.id} doesn't exist` ))
        }
    } catch (error) {
        next(error)
    }
})
authorsRouter.put("/:id", async (req,res, next) => {
    try {
        const author = await authorsModel.findById(req.params.id)
        const modifiedAuthor = await authorsModel.findByIdAndUpdate(author, req.body, {
            new: true
        })
        if (modifiedAuthor){
            res.send(modifiedAuthor)
        } else {
            next(createHttpError(404, `Author with id ${req.params.id} doesn't exist`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/:id/posts", async (req, res, next)=> {
    try {
        const author = await authorsModel.findById(req.params.id)  
        const postID = req.body.postId
        const post = await postsModel.findById(postID)
        const newPost = {... post.toObject(), posts: req.body.posts} 
        const thatPost = await authorsModel.findOneAndUpdate(
            {posts: req.params.id, status: "active"},
            {$push: {posts: newPost}},
            {
                new: true,
                upsert: true
            }
        )
        res.send(thatPost)

    } catch (error) {
        next(error)
    }
})

// ******** Authentication ************

authorsRouter.post("/registration", async (req,res, next) => {
    try {
        const newAuthor = new authorsModel(req.body)
        const author = await newAuthor.save()
        res.send(author)
    } catch (error) {
        next(error)  
    }
})

authorsRouter.get("/", authorization, async (req, res, next) => {
    try {
        const authors = await authorsModel.find()
        res.send(authors)
    } catch (error) {
        next(error) 
    }
})


export default authorsRouter