"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('imagePost', postSchema);
