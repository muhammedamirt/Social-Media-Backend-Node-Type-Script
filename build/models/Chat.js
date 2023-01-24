"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    members: {
        type: Array
    }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('chats', chatSchema);
