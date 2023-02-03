import { Schema, model } from 'mongoose'

interface Report {
  postId: string
  reason: string
  userId: string
}

const reportSchema = new Schema<Report>({
  postId: { type: String },
  userId: { type: String },
  reason: { type: String }
}, {
  timestamps: true
})

export default model<Report>('report', reportSchema)
