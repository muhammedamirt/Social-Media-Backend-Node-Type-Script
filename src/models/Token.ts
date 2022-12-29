import { model, Schema, Document, Date } from "mongoose"

interface token extends Document {
    userId: string;
    token: String;
    createdAt: Date;
}
const tokenSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }
})

export default model<token>('token', tokenSchema)