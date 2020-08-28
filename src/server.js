import sirv from "sirv"
import express from "express"
import logger from "morgan"
import compression from "compression"
import cookies from "cookie-parser"
import * as sapper from "@sapper/server"
import expressJwt from "express-jwt"

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === "development"

const defaultHeaders = function (req, res, next) {
  res.setHeader("Content-Type", "application/json")
  // res.setHeader("Cache-Control", "max-age=30");
  next()
}

express() // You can also use polka, but it doesn't have as many helpful features
  .use(
    compression(),
    express.json(),
    cookies(),
    logger("dev"),
    sirv("static", { dev }),
    expressJwt({
      secret: "shhhhhhared-secret",
      requestProperty: "auth",
      algorithms: ["HS256"],
      credentialsRequired: false,
      getToken: (req) => req.cookies.auth,
    }),
    defaultHeaders,
    sapper.middleware({
      session: (req) => req.auth,
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err)
  })
