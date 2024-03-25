import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import 'dotenv/config'
import { taskRoutes } from './routes/taskRoutes'
import { ErrorResponse } from './models/errorResponse'

const apiPort = process.env.API_PORT
const mongoUrl = process.env.MONGODB_URL
const dbName = 'tasks'
const mongoConnectString = `${mongoUrl}/${dbName}`

const app = express()

app.use(json())

app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.setHeader('Content-Type', 'application/json')
    next()
})

app.use('/tasks', taskRoutes)


// Custom error handling using errorResponse.ts model
app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorResponse) {
        res.status(err.errorCode).json({ code: err.errorCode, message: err.message })
    } else {
        res.status(404).json({ code: 404, message: 'Invalid route.' })
    }
})

mongoose
    .connect(mongoConnectString)
    .then(() => {
        console.log(`Connected to ${dbName} database.`)
        app.listen(apiPort, () => {
            console.log(`Backend listening on port ${apiPort}.`)
        })
    })
    .catch((error) => {
        console.log(`Connection to ${dbName} database failed.`, error.message)
    })
