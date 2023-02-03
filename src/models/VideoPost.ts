import { Schema, model } from 'mongoose'

interface IVideo {
  userId: string
  url: string
  likes: any[]
  captions: string
}

const videoSchema = new Schema<IVideo>({
  userId: {
    type: String,
    ref: 'user',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: [],
    required: true
  },
  captions: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

export default model<IVideo>('video', videoSchema)
