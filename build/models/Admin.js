"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
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
});
exports.default = (0, mongoose_1.model)('admin', adminSchema);
