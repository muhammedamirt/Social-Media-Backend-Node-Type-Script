import { Schema, model } from 'mongoose'

interface message {
  chatId: string
  senderId: string
  text: string
}

const messageSchema = new Schema<message>({
  chatId: {
    type: String
  },
  senderId: {
    type: String
  },
  text: {
    type: String
  }
}, {
  timestamps: true
})

export default model<message>('message', messageSchema)
