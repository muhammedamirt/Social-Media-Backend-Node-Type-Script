import { model, Schema, Document } from 'mongoose'

interface IUser extends Document {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
}

const adminSchema: Schema = new Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    text: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    text: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    text: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
})

export default model<IUser>('admin', adminSchema)
