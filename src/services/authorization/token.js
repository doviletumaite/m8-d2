import createHttpError from "http-errors"
import { verifyJWT } from "./tools.js"

export const JWTAuthenticationMiddle = (req, res, next)=>{
    if (!req.headers.authorization){
        next(createHttpError(401, "pls the header has been provided"))
    } else {
      try {
          const token = req.headers.authorization.replace("Bearer " , "")
          const decodedToken = await verifyJWT(token)
          console.log("Decoded token", decodedToken)
          next()
      } catch (error) {
          console.log(error)
          next(createHttpError(401, "token ahi ahi"))

      }
    }
}