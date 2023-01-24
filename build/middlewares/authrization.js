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
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, '===1');
    try {
        const authHeader = req.headers.authorization;
        if (authHeader == null) {
            return res.status(401).send({
                message: 'auth failed',
                Status: false
            });
        }
        const [, token] = authHeader.split(' ');
        jsonwebtoken_1.default.verify(token, `${process.env.SECRET_TOKEN}`, (err, decoded) => {
            if (err != null) {
                return res.send({
                    message: 'auth failed',
                    Status: false
                });
            }
            else {
                const { id } = decoded;
                req.body.userId = id;
                next();
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(401).send({
            message: 'auth failed',
            success: false
        });
    }
});
