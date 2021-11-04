import express from "express"
import createHttpError from "http-errors";
import { generateJWT } from "../authorization/tools.js"
import authorsModel from "./schema.js"

const authorizationRouter = express.Router();

 authorizationRouter.post("/login", async (req , res , next) => {
   try {
    const {name, password} = req.body
    if (!name || !password){
     next(createHttpError(401, "bad credentials"))
    }
    const author = await authorsModel.checkCredentials(name, password)
    if (!author) {     
     next(createHttpError(401, "credentials not matching")) 
    }
    const token = await generateJWT({_id: author._id})
    res.status(200).send({token})
   } catch (error) {
       next(error)
   }
})

authorizationRouter.post("/registration", async (req,res, next) => {
    try {
        const newAuthor = await new authorsModel(req.body).save()
        console.log("newAuthor",newAuthor)
        const token = await generateJWT({_id: newAuthor._id})
        res.send({newAuthor, token})
    } catch (error) {
        next(error)  
    }
})

export default authorizationRouter