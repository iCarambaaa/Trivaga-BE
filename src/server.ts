import express from "express"
import cors from "cors"
import  listEndpoints from "express-list-endpoints"


const server = express()

server.use(cors())
server.use(express.json())

console.table(listEndpoints(server))

export default server