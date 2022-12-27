"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
        unique: true
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
});
exports.default = (0, mongoose_1.model)('user', userSchema);
