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
const Token_1 = __importDefault(require("../models/Token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
// import { generateUploadUrl } from '../utils/s3'
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const sentEmail_1 = __importDefault(require("../utils/sentEmail"));
const saltRounds = 10;
exports.default = {
    getHome: (req, res) => {
        res.status(200).send({ status: true });
    },
    postRegister: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { first_name: firstName, last_name: lastName, username, email, password } = req.body;
            const userNameExist = yield User_1.default.findOne({ username });
            if (userNameExist != null) {
                res.json({ message: 'username Exist', userNameExist: true });
            }
            const emailExist = yield User_1.default.findOne({ email });
            if (emailExist != null) {
                res.send({ message: 'Email Exist', emailExist: true });
            }
            else {
                const user = yield new User_1.default({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    email,
                    password: yield bcrypt_1.default.hash(password, saltRounds)
                }).save();
                const userToken = yield new Token_1.default({
                    userId: user._id,
                    token: crypto_1.default.randomBytes(32).toString('hex')
                }).save();
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                const Url = `${process.env.BASE_URL}${user.id}/verify/${userToken.token}`;
                void (0, sentEmail_1.default)(user.email, 'verify Email', Url);
                res.status(200).send({ sendEmail: true });
            }
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }),
    postLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const userData = yield User_1.default.findOne({ email });
        if (userData == null) {
            res.json({ message: "This email don't have any account", emailError: true });
        }
        else {
            const passwordVerify = yield bcrypt_1.default.compare(password, userData === null || userData === void 0 ? void 0 : userData.password);
            if (passwordVerify) {
                const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: userData._id.toString() }, '30m');
                res.status(200).cookie('userAuthentication', jwtVerificationToken, {
                    httpOnly: false,
                    maxAge: 600 * 1000
                }).json({ message: 'login success', success: true, token: jwtVerificationToken });
            }
            else {
                res.json({ message: 'Wrong Password', passwordError: true });
            }
        }
    }),
    verifyEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const Verify = {
            Status: false,
            message: ''
        };
        try {
            const user = yield User_1.default.findOne({ _id: req.params.id });
            if (user == null)
                return res.status(400).send('Invalid link');
            const tokenData = yield Token_1.default.findOne({
                userId: user._id,
                Token: req.params.token
            });
            Verify.message = 'Invalid link';
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (!Token_1.default)
                return res.status(400).send(Verify);
            yield User_1.default.updateOne({ _id: user._id, verified: true });
            yield Token_1.default.findByIdAndRemove(tokenData === null || tokenData === void 0 ? void 0 : tokenData._id);
            Verify.Status = true;
            Verify.message = 'email verified successful';
            const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: user._id.toString() }, '30m');
            const response = {
                jwtVerificationToken,
                Verify
            };
            res.cookie('userAuthentication', jwtVerificationToken, {
                httpOnly: false,
                maxAge: 600 * 1000
            }).status(200).send(response);
        }
        catch (error) {
            Verify.Status = false;
            Verify.message = 'An error occurred';
            res.status(400).send(Verify);
        }
    }),
    postImageUpload: (req, res) => {
        console.log(req.body);
    }
};
