import createHttpError from "http-errors"
import atob from "atob"

// middleware for auth 
export const authorization = (req, res, next) => {
    console.log(req.headers)
    if(!req.headers.authorization){
       next(createHttpError(401, "Authorization header needed"))
    } else {
        console.log(atob(req.headers.authorization.split(" ")[1]))
      next()   
    }
}