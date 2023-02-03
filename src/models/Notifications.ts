import mongoose, { Schema, Document } from 'mongoose'

export interface notification extends Document {
  PostId: string
  userText: [{
    userId: mongoose.Types.ObjectId
    text: string
  }]
}

const NotificationSchema: Schema = new Schema({
  PostId: {
    type: Schema.Types.ObjectId,
    ref: 'post'
  },
  notification: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      reason: {
        type: String
      }
    }
  ]
})

export default mongoose.model<notification>('notification', NotificationSchema)
