import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import  authorsModel  from "../authors/schema.js"

export const JWTAuthenticate = async author => {
    const accessToken = await generateJWT({_id: author._id})
    console.log("id", author._id)
    return accessToken
}

export const generateJWT = payload => new Promise( (resolve, reject) =>
  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1 week"}, (err, token) =>{
   if(err){
    reject(err)
   }else {
    resolve(token)
   }
}))

export const verifyJWT = token => new Promise ( (res, rej) => 
jwt.verify(token, process.env.JWT_SECRET), (err, decodedToken)=> {
    if (err) rej(err)
    else res(decodedToken)
})

export const JwtMiddlewareCheck =  async (req, res, next)  => {
try {
    if(!req.headers.authorization) {
        next(createHttpError(401, "authorization needed"))
    } else {
        const token = req.headers.authorization.replace("Bearer", '')
        console.log("token", token)
        const decodedToken = await verifyJWT(token)
        const author = authorsModel.findById(decodedToken.id)
        req.author = author
        next()
    }
} catch (error) {
    next(error)
}
}

// generateJWT({})
// .then(token=> console.log(token))
// .catch(error => console.log(error))
// await generateJWT({})

