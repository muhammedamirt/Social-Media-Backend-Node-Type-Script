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
        type: String
    },
    picture: {
        type: String,
        default: 'https://res.cloudinary.com/dvh94pdmb/image/upload/v1674021312/Defualt_Profile_pic_cjcixd.webp'
    },
    cover: {
        type: String,
        default: 'https://res.cloudinary.com/dvh94pdmb/image/upload/v1675311875/default-cover_p7wwym.png'
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
    googleAuth: {
        type: Boolean,
        default: false
    },
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
});
exports.default = (0, mongoose_1.model)('user', userSchema);
