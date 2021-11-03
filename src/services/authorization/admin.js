import createHttpError from "http-errors"

export const AdminOnly = async (req, res, next) => {
    if(req.author.role === "Admin"){
        next() 
    }else{
        next(createHttpError(403, "admins only"))
    }
    
}