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
    const author = authorsModel.checkCredentials(name, password)
    if (!author) {     
     next(createHttpError(401, "credentials not matching")) 
    }
    const token = await generateJWT({author})
    res.status(200).send({token})
   } catch (error) {
       next(error)
   }
})

export default authorizationRouter