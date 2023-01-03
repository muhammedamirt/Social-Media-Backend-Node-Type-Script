"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Access'
    ]
}));
app.use('/', user_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/WouldDo').then(() => {
    console.log('database connected');
}).catch((err) => {
    console.log(err);
});
const port = 5000;
app.listen(port, () => {
    console.log(`server running on port${port}`);
});
