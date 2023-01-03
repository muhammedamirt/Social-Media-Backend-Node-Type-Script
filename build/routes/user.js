"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
router.get('/', user_1.default.getHome);
router.post('/register', user_1.default.postRegister);
router.post('/login', user_1.default.postLogin);
router.get('/verifySignup/:id/:token', user_1.default.verifyEmail);
exports.default = router;
