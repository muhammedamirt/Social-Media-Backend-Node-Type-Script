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
exports.getIsBlocked = exports.getAllUsers = exports.adminLogin = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Admin_1 = __importDefault(require("../models/Admin"));
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const User_1 = __importDefault(require("../models/User"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { email, password } = req.body;
    const adminData = yield Admin_1.default.findOne({ email });
    if (adminData == null) {
        res.json({ message: "This email don't have any account", emailError: true });
    }
    else {
        // const passwordVerify: boolean = await bcrypt.compare(password, adminData?.password)
        const passwordVerify = password === (adminData === null || adminData === void 0 ? void 0 : adminData.password);
        if (passwordVerify) {
            const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: adminData._id.toString() }, '30m');
            res.status(200).cookie('userAuthentication', jwtVerificationToken, {
                httpOnly: false,
                maxAge: 600 * 1000
            }).json({ message: 'login success', success: true, token: jwtVerificationToken, id: adminData === null || adminData === void 0 ? void 0 : adminData._id });
        }
        else {
            res.json({ message: 'Wrong Password', passwordError: true });
        }
    }
});
exports.adminLogin = adminLogin;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        if (users !== null) {
            res.status(200).json(users);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
exports.getAllUsers = getAllUsers;
const getIsBlocked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.userId);
        const user = yield User_1.default.findOne({ _id: req.params.userId });
        if (user !== null) {
            if (!(user === null || user === void 0 ? void 0 : user.isBlocked)) {
                user.isBlocked = true;
                void user.save();
                res.status(200).json({ userBlocked: true });
            }
            else {
                user.isBlocked = false;
                void user.save();
                res.status(200).json({ userUnBlocked: true });
            }
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getIsBlocked = getIsBlocked;
