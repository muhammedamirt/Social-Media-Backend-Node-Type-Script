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
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const saltRounds = 10;
exports.default = {
    getHome: (req, res) => {
        res.status(200).send({ status: true });
    },
    postRegister: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { first_name, last_name, username, email, password } = req.body;
            const userNameExist = yield User_1.default.findOne({ username });
            if (userNameExist) {
                res.json({ message: "username Exist" });
            }
            const emailExist = yield User_1.default.findOne({ email });
            if (emailExist) {
                res.send({ message: "Email Exist" });
            }
            else {
                const user = yield new User_1.default({
                    first_name,
                    last_name,
                    username,
                    email,
                    password: yield bcrypt_1.default.hash(password, saltRounds)
                }).save();
                const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: user._id.toString() }, '30m');
                console.log(jwtVerificationToken);
                res.status(200).json(user);
            }
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    postLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const userData = yield User_1.default.findOne({ email });
        if (!userData) {
            res.json({ message: "Account doesn't Exist" });
        }
        else {
            const passwordVerify = yield bcrypt_1.default.compare(password, userData === null || userData === void 0 ? void 0 : userData.password);
            if (passwordVerify) {
                res.status(200).json({ message: "login success" });
            }
            else {
                res.json({ message: "Wrong Password" });
            }
        }
    })
};
