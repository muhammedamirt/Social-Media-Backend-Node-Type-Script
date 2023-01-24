import { model, Schema, Document, Date } from 'mongoose'

interface IPosts extends Document {
  userId: string
  postId: string
  text: string
  image: string
  date: Date
  comments: any[]
  likes: any[]
}

const postSchema: Schema = new Schema({
  userId: {
    type: String,
    require: true,
    ref: 'user'
  },
  text: {
    type: String
  },
  image: {
    type: String
  },
  video: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  comments: {
    type: Array,
    required: true,
    default: []
  },
  likes: [{
    type: String
  }]
})
export default model<IPosts>('imagePost', postSchema)
