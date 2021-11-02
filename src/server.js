import express from "express"
import cors from "cors"
import mongoose  from "mongoose"
import listEndpoints from "express-list-endpoints"

const server = express()
const port = process.env.PORT
server.use(cors())

console.table(listEndpoints(server))

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("we're connected with MongoDB :]")
    server.listen(port, () => {
      console.log(`server 🏃‍♂️ on port ${port}`)
    })
})