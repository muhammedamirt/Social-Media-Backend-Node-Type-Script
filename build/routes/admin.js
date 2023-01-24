"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const router = express_1.default.Router();
router.post('/adminLogin', admin_1.adminLogin);
router.get('/allUsers', admin_1.getAllUsers);
router.put('/getIsBlocked/:userId', admin_1.getIsBlocked);
exports.default = router;
