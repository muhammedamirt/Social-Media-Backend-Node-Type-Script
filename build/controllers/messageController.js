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
exports.getMessages = exports.addMessage = void 0;
const MessageModel_1 = __importDefault(require("../models/MessageModel"));
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel_1.default({
        chatId,
        senderId,
        text
    });
    try {
        const result = yield message.save();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.addMessage = addMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const result = yield MessageModel_1.default.find({
            chatId
        });
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getMessages = getMessages;
