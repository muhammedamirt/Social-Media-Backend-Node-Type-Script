/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import dotenv from 'dotenv'
import express, { Application } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/user'
import adminRoute from './routes/admin'
import chatRoute from './routes/chatRoute'
import messageRouter from './routes/messageRouter'
import bodyParser from 'body-parser'
dotenv.config()
const app: Application = express()

const io = require('socket.io')(8800, {
  cors: {
    origin: 'http://localhost:3000'
  }
})
let activeUser: any[] = []

io.on('connection', (socket: any) => {
  socket.on('new-user-add', (newUserId: string) => {
    if (!activeUser.some((user) => user.userId === newUserId)) {
      activeUser.push({
        userId: newUserId,
        socketId: socket.id
      })
    }
    io.emit('get-user', activeUser)
  })
  socket.on('send-message', (data: any) => {
    const { receiverId } = data
    const user = activeUser.find((user) => user.userId === receiverId)
    if (user) {
      io.to(user.socketId).emit('receive-message', data)
    }
  })
  socket.on('disconnect', () => {
    activeUser = activeUser.filter((user) => user.socketId !== socket.id)
    console.log('user disconnect ', activeUser)
    io.emit('get-user', activeUser)
  })
})

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}))

app.use('/', userRoute)
app.use('/admin', adminRoute)
app.use('/chat', chatRoute)
app.use('/messages', messageRouter)

mongoose.set('strictQuery', true)

mongoose.connect('mongodb://localhost:27017/WouldDo').then(() => {
  console.log('database connected')
}).catch((err) => {
  console.log(err)
})
const port = 5000
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
