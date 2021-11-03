import jwt from "jsonwebtoken"

export const JWTAuthenticate = async author => {
    const accessToken = await generateJWT({_id: author._id})
    console.log("id", author._id)
    return accessToken
}

 const generateJWT = payload => new Promise( (resolve, reject) =>
  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1 week"}, (err, token) =>{
   if(error){
    reject(error)
   }else {
    resolve(token)
   }
}))

// generateJWT({})
// .then(token=> console.log(token))
// .catch(error => console.log(error))
// await generateJWT({})