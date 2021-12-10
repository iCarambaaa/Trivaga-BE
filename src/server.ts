import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

process.env.TS_NODE_DEV && require("dotenv").config();

const server = express();

server.use(cors());
server.use(express.json());

console.table(listEndpoints(server));

export default server;
