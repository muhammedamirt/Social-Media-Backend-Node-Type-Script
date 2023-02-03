"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const reportPostController_1 = require("../controllers/reportPostController");
const router = express_1.default.Router();
router.post('/', reportPostController_1.reportPost);
router.put('/cancel-report', reportPostController_1.cancelReport);
exports.default = router;
