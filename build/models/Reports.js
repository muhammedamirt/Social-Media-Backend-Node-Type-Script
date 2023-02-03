"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    postId: { type: String },
    userId: { type: String },
    reason: { type: String }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('report', reportSchema);
