import express from "express"
import cors from "cors"
import mongoose  from "mongoose"
import listEndpoints from "express-list-endpoints"
import { badRequestHandler, genericErrorHandler, notFoundHandler } from "./errorHandler.js"
import postsRouter from "./services/posts/index.js"
import authorsRouter from "./services/authors/index.js"
import authorizationRouter from "./services/authors/authentication.js"


const server = express()
const port = process.env.PORT
server.use(cors())
server.use(express.json())



mongoose.connect(process.env.MONGO_CONNECTION)

server.use(notFoundHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)

server.use("/posts", postsRouter)
server.use("/authors", authorsRouter)
server.use("/authentication", authorizationRouter)
console.table(listEndpoints(server))

mongoose.connection.on("connected", () => {
    console.log("we're connected with MongoDB :]")
    server.listen(port, () => {
      console.table(listEndpoints(server))
      console.log(`server 🏃‍♂️ on port ${port}`)
    })
})
mongoose.connection.on("error", err => {
  console.log(err)
})