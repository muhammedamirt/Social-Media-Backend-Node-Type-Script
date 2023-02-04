/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import dotenv from 'dotenv'
import express, { Application } from 'express'
import mongoose from 'mongoose'
// import cors from 'cors'
import userRoute from './routes/user'
import adminRoute from './routes/admin'
import chatRoute from './routes/chatRoute'
import messageRouter from './routes/messageRouter'
import reportRoute from './routes/reportPostRoute'
import bodyParser from 'body-parser'
dotenv.config()
const app: Application = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(cors({
//   origin: ['https://www.woulddo.iworldecart.shop/'],
//   methods: ['GET', 'POST', 'DELETE', 'PUT'],
//   credentials: true
// }))

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://www.woulddo.iworldecart.shop')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  // Pass to next layer of middleware
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  next()
})

app.use('/', userRoute)
app.use('/admin', adminRoute)
app.use('/chat', chatRoute)
app.use('/messages', messageRouter)
app.use('/report', reportRoute)

mongoose.set('strictQuery', true)

mongoose.connect('mongodb://localhost:27017/WouldDo').then(() => {
}).catch((err) => {
  return err
})
const port = 5000
app.listen(port)
