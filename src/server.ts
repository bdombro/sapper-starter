import sirv from "sirv"
import express from "express"
import logger from "morgan"
import compression from "compression"
import cookies from "cookie-parser"
import * as sapper from "@sapper/server"
import ua from "express-useragent"
import { jwtMiddleware } from "./lib/crypto"

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === "development"

const defaultHeaders = function (req, res, next) {
  res.type("application/json") // default, can be overridden
  next()
}

express() // You can also use polka, but it doesn't have as many helpful features
  .use(
    compression(),
    express.json(),
    ua.express(),
    cookies(),
    logger("dev"),
    sirv("static", { dev }),
    jwtMiddleware,
    defaultHeaders,
    sapper.middleware({
      session: (req) => req.auth,
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err)
  })
