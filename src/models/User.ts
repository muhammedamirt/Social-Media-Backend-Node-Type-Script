import { model, Schema, Document } from 'mongoose'

interface IUser extends Document {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  isLogged: boolean
  isBlocked: boolean
  picture: string
  cover: string
  country: string
  place: string
  verified: Boolean
  friends: string
  following: any[]
  followers: any[]
  Posts: string[]
  saved: any[]
}

const userSchema: Schema = new Schema({
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
  },
  picture: {
    type: String,
    default: 'https://res.cloudinary.com/dvh94pdmb/image/upload/v1674021312/Defualt_Profile_pic_cjcixd.webp'
  },
  cover: {
    type: String,
    default: 'https://www.lonelyplanet.fr/sites/lonelyplanet/files/styles/manual_crop/public/media/destination/slider/mobile/gettyrf_461358497.jpg?itok=m-6c7QZ0'
  },
  country: {
    type: String,
    default: 'country'
  },
  isLogged: {
    type: Boolean,
    default: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  place: {
    type: String,
    default: 'place'
  },
  about: {
    type: String,
    default: 'Hello,Iam New On WouldDo Media'
  },
  verified: {
    type: Boolean,
    default: false
  },
  // friends: {
  //   type: Array,
  //   default: []
  // },
  following: {
    type: Array,
    default: []
  },
  followers: {
    type: Array,
    default: []
  },
  Posts: {
    type: Array,
    default: []
  },
  saved: {
    type: Array,
    default: []
  }
})

export default model<IUser>('user', userSchema)
