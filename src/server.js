import sirv from 'sirv'
import polka from 'polka'
import logger from 'morgan'
import compression from 'shrink-ray-current'
import * as sapper from '@sapper/server'
import { json } from 'body-parser'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

const defaultHeaders = function (req, res, next) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'max-age=30')
  next()
}

polka() // You can also use Express
  .use(
    json(),
    compression(),
    logger('dev'),
    sirv('static', { dev }),
    defaultHeaders,
    sapper.middleware(),
  )
  .listen(PORT, (err) => {
    if (err) console.log('error', err)
  })
