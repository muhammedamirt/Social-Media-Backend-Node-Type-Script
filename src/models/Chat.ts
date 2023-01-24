import { Schema, model } from 'mongoose'

interface Chats {
  members: any
}

const chatSchema = new Schema<Chats>({
  members: {
    type: Array
  }
}, {
  timestamps: true
})

export default model<Chats>('chats', chatSchema)
