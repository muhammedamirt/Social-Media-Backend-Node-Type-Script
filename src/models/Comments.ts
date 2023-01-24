import { Schema, model } from 'mongoose'

interface Comment {
  postId: string
  comment: string
  userId: string
}

const commentSchema = new Schema<Comment>({
  postId: {
    type: String,
    ref: 'post',
    required: true
  },
  userId: {
    type: String,
    ref: 'user',
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default model<Comment>('comment', commentSchema)
