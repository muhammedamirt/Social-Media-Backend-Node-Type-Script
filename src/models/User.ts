import { model, Schema, Document } from "mongoose"

interface IUser extends Document {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    picture: string;
    verified: Boolean;
    friends: string;
    following: string;
    followers: string;
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
        text: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: "#"
    },
    verified: {
        type: Boolean,
        default: false
    },
    friends: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    requests: {
        type: Array,
        default: []
    }
})

export default model<IUser>('user', userSchema)