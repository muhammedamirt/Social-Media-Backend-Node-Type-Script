"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelReport = exports.reportPost = void 0;
const Reports_1 = __importDefault(require("../models/Reports"));
const reportPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, reason } = req.body;
    try {
        const report = new Reports_1.default({
            userId,
            postId,
            reason
        });
        yield report.save();
        res.status(201).json({ report, status: true });
    }
    catch (error) {
        res.status(error).json(error);
    }
});
exports.reportPost = reportPost;
const cancelReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.body;
    try {
        const report = yield Reports_1.default.findOne({ userId, postId });
        if (report != null) {
            yield report.deleteOne();
            res.status(200).json({ status: true, message: 'report deleted successfully' });
        }
        else {
            res.status(404).json({ status: false, message: 'no report found' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.cancelReport = cancelReport;
