import express from 'express'
import logger from 'morgan'
import mainRouter from './routes/router.js'
import cors from 'cors';
import { Util } from './utils/util.js';

const main = async () => {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(logger('dev'))

  app.use('/', mainRouter)

  // Error handler.
  app.use(function (err, req, res, next) {
    res.status(500).json(err)
  })

  app.listen(process.env.PORT, () => {
    console.log(`Automation service listening on port http://localhost:${process.env.PORT}`)
  })
}

main().catch(console.error)


