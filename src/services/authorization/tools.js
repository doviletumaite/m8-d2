import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import  authorsModel  from "../authors/schema.js"

export const JWTAuthenticate = async author => {
    const accessToken = await generateJWT({_id: author._id})
    const refreshToken = await generateRefreshJWT({_id: author._id})
    author.refreshToken = refreshToken
    console.log("refresh ciaoooooooo", refreshToken)
    await author.save()
    return {accessToken , refreshToken}
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
    console.log("token passed through verifyJWT",token)
    if (err) rej(err)
    else res(decodedToken) 
    console.log("decodedToken",decodedToken)
})

export const generateRefreshJWT = payload => new Promise( (resolve, reject) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "15 min"}, (err, token) =>{
   if(err){
    reject(err)
   }else {
    resolve(token)
   }
}))

export const verifyRefreshJWT = token => new Promise ( (res, rej) => 
jwt.verify(token, process.env.JWT_REFRESH_SECRET), (err, decodedToken)=> {
    console.log("token passed through verifyJWT",token)
    console.log("token passed through JWT_REFRESH_SECRET",JWT_REFRESH_SECRET)
    if (err) rej(err)
    else res(decodedToken) 
    console.log("decodedToken",decodedToken)
})
export const JwtMiddlewareCheck =  async (req, res, next)  => {
try {
    if(!req.headers.authorization) {
        next(createHttpError(401, "authorization needed"))
    } else {
        const token = req.headers.authorization.replace("Bearer", '')
        console.log("token", token)
        const decodedToken = await verifyJWT(token)
        const author = await authorsModel.findById(decodedToken.id)
        console.log(decodedToken.id)
        console.log("author", author)
        req.author = author
        next()
    }
} catch (error) {
    next(error)
}
}

export const verifyRefreshAndGenerate = async actualRefresh => {
   const decodedRefresh =  await verifyRefreshJWT(actualRefresh)
   console.log(actualRefresh)
   const author = await authorsModel.findById(decodedRefresh._id)
   if(!user) throw createHttpError(404, 'user not found :[')
   if(user.refreshToken && user.refreshToken === actualRefresh){
   const {accessToken, refreshToken} = await JWTAuthenticate(author)
   console.log("heloo")
   console.log(author)
   return {accessToken, refreshToken}
   } else throw createHttpError(401, 'refresh token not valid :[')
}

// generateJWT({})
// .then(token=> console.log(token))
// .catch(error => console.log(error))
// await generateJWT({})

