import sirv from "sirv"
import express from "express"
import logger from "morgan"
import compression from "compression"
import cookies from "cookie-parser"
import * as sapper from "@sapper/server"
import ua from "express-useragent"
import { jwtMiddleware } from "./lib/crypto"
import db from "./lib/db"


const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === "development"

const defaultHeaders = function(req, res, next) {
  res.type("application/json") // default, can be overridden
  next()
}

const app = express() // You can also use polka, but it doesn't have as many helpful features

const server =
  app
    .use(
      compression(),
      express.json(),
      ua.express(),
      cookies(),
      logger("dev"),
      sirv("static", { dev }),
      jwtMiddleware,
      defaultHeaders,
      // @ts-ignore: sapper middleware is not typesafe wrt express middelware
      sapper.middleware({
        session: (req) => req.auth
      })
    )
    .listen(PORT)

server
  .on("error", (e) => {
    // @ts-ignore: ts doesn't know of code attribute
    if (e.code === "EADDRINUSE")
      console.log("Address in use :-(")
    else
      console.log("Unknown express error!")
    server.close()
  })
  .on("close", () => console.log("Http server closed."))


function handleExit(signal) {
  console.log(`Received exit signal ${signal}`);
  server.close()
  // Force exit if express doesn't close in a reasonable amount of time.
  setTimeout(() => process.exit(1), 60000);
}
process.on('exit', handleExit);
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);


db.post.findMany().then(p => console.dir);