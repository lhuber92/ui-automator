import express from 'express'
import createError from 'http-errors'
import {router as chatRouter} from './chat-router.js'

const router = express.Router()

router.use('/chat', chatRouter)

router.use('*', (req, res, next) => next(createError(404)))

export default router