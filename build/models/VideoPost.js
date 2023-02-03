"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('video', videoSchema);
