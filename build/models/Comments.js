"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('comment', commentSchema);
