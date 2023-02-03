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
exports.findChat = exports.userChats = exports.createChat = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Chat_1 = __importDefault(require("../models/Chat"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatExist = yield Chat_1.default.findOne({
            members: {
                $all: [req.body.senderId, req.body.receiverId]
            }
        });
        if (chatExist !== null) {
            res.status(200).json({ chatExist: true });
        }
        else {
            const newChat = new Chat_1.default({
                members: [req.body.senderId, req.body.receiverId]
            });
            const result = yield newChat.save();
            res.status(200).json(result);
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.createChat = createChat;
const userChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield Chat_1.default.find({
            members: { $in: [req.params.userId] }
        }).sort({ createdAt: -1 });
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.userChats = userChats;
const findChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield Chat_1.default.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] }
        });
        res.status(200).json(chat);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.findChat = findChat;
