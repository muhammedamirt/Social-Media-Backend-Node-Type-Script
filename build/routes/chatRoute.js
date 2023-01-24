"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
const router = express_1.default.Router();
router.post('/', chatControllers_1.createChat);
router.get('/:userId', chatControllers_1.userChats);
router.get('/find/firstId/:secondId', chatControllers_1.findChat);
exports.default = router;
