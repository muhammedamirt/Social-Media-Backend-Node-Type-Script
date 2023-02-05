"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// import cors from 'cors'
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const messageRouter_1 = __importDefault(require("./routes/messageRouter"));
const reportPostRoute_1 = __importDefault(require("./routes/reportPostRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// app.use(cors({
//   origin: ['https://www.woulddo.iworldecart.shop/'],
//   methods: ['GET', 'POST', 'DELETE', 'PUT'],
//   credentials: true
// }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/', user_1.default);
app.use('/admin', admin_1.default);
app.use('/chat', chatRoute_1.default);
app.use('/messages', messageRouter_1.default);
app.use('/report', reportPostRoute_1.default);
mongoose_1.default.set('strictQuery', true);
const mongoURL = (_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : '';
mongoose_1.default.connect(mongoURL).then(() => {
    console.log('database connected');
}).catch((err) => {
    return err;
});
const port = 5000;
app.listen(port);
