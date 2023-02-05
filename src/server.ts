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
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/', userRoute)
app.use('/admin', adminRoute)
app.use('/chat', chatRoute)
app.use('/messages', messageRouter)
app.use('/report', reportRoute)

mongoose.set('strictQuery', true)
const mongoURL = process.env.MONGO_URL ?? ''

mongoose.connect(mongoURL).then(() => {
  console.log('database connected')
}).catch((err) => {
  return err
})
const port = 5000
app.listen(port)
