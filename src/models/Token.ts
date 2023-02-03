import { model, Schema, Document, Date } from 'mongoose'

interface token extends Document {
  userId: string
  token: String
  createdAt: Date
}
const tokenSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'user'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600
  }
})

export default model<token>('token', tokenSchema)
