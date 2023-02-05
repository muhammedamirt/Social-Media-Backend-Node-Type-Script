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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const sendEmail = (email, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const transporter = nodemailer.createTransport({
        //   host: process.env.HOST,
        //   service: process.env.SERVICE,
        //   port: 587,
        //   secure: true,
        //   auth: {
        //     user: process.env.USER,
        //     pass: process.env.PASS
        //   }
        // })
        const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET_ID, 'https://www.wouldoback.iworldecart.shop');
        const accessToken = oauth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET_ID,
                accessToken
            }
        });
        // oauth2Client.setCredentials({
        //   refresh_token: "your-refresh-token"
        // });
        yield transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject,
            text
        });
        console.log('email sent success full');
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = sendEmail;
