"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const admin_1 = __importDefault(require("./routes/admin"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const messageRouter_1 = __importDefault(require("./routes/messageRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const io = require('socket.io')(8800, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
let activeUser = [];
io.on('connection', (socket) => {
    socket.on('new-user-add', (newUserId) => {
        if (!activeUser.some((user) => user.userId === newUserId)) {
            activeUser.push({
                userId: newUserId,
                socketId: socket.id
            });
        }
        io.emit('get-user', activeUser);
    });
    socket.on('send-message', (data) => {
        const { receiverId } = data;
        const user = activeUser.find((user) => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit('receive-message', data);
        }
    });
    socket.on('disconnect', () => {
        activeUser = activeUser.filter((user) => user.socketId !== socket.id);
        console.log('user disconnect ', activeUser);
        io.emit('get-user', activeUser);
    });
});
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use('/', user_1.default);
app.use('/admin', admin_1.default);
app.use('/chat', chatRoute_1.default);
app.use('/messages', messageRouter_1.default);
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect('mongodb://localhost:27017/WouldDo').then(() => {
    console.log('database connected');
}).catch((err) => {
    console.log(err);
});
const port = 5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
