import dotenv from 'dotenv'
import express, { Application } from "express"
import mongoose from "mongoose"
import cors from 'cors'
import userRoute from './routes/user'
dotenv.config()
const app: Application = express()

app.use(express.json())

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Access'
    ]
}))

app.use('/', userRoute) 

mongoose.connect("mongodb://localhost:27017/WouldDo").then(() => {
    console.log('database connected');
}).catch((err) => {
    console.log(err);
})
const port = 5000
app.listen(port, () => {
    console.log(`server running on port${port}`);
})
