"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postImageSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'user'
    },
    text: {
        type: String
    },
    image: {
        type: String,
        required: true
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
    likes: {
        type: Array,
        default: []
    }
});
exports.default = (0, mongoose_1.model)('imagePost', postImageSchema);
