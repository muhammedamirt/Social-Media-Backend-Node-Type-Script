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
const Posts_1 = __importDefault(require("../models/Posts"));
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const sentEmail_1 = __importDefault(require("../utils/sentEmail"));
const mongoose_1 = __importDefault(require("mongoose"));
const Comments_1 = __importDefault(require("../models/Comments"));
const VideoPost_1 = __importDefault(require("../models/VideoPost"));
const qrcode_1 = __importDefault(require("qrcode"));
const saltRounds = 10;
exports.default = {
    getHome: (req, res) => {
        res.status(200).send({ status: true });
    },
    postRegister: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { first_name: firstName, last_name: lastName, username, email, password } = req.body;
            // const userNameExist = await User.findOne({ username })
            // if (userNameExist != null) {
            //   res.send({ message: 'username Exist', userNameExist: true })
            // }
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
                const Url = `${process.env.BASE_URL}/${user.id}/verify/${userToken.token}`;
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
                userData.isLogged = true;
                yield userData.save();
                const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: userData._id.toString() }, '30m');
                res.status(200).cookie('userAuthentication', jwtVerificationToken, {
                    httpOnly: false,
                    maxAge: 600 * 1000
                }).json({ message: 'login success', success: true, token: jwtVerificationToken, id: userData === null || userData === void 0 ? void 0 : userData._id });
            }
            else {
                res.json({ message: 'Wrong Password', passwordError: true });
            }
        }
    }),
    verifyEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, token } = req.params;
        const Verify = {
            Status: false,
            message: ''
        };
        try {
            console.log(id);
            const user = yield User_1.default.findById(id);
            console.log(user);
            if (user == null)
                return res.status(400).send('Invalid link');
            const tokenData = yield Token_1.default.findOne({
                userId: user._id,
                Token: token
            });
            console.log(tokenData);
            Verify.message = 'Invalid link';
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (!Token_1.default)
                return res.status(400).send(Verify);
            yield User_1.default.updateOne({ _id: user._id }, { verified: true });
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
            console.log(error);
            Verify.Status = false;
            Verify.message = 'An error occurred';
            res.status(500).send(error);
        }
    }),
    postImageUpload: (req, res) => {
    },
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = yield User_1.default.findById(req.params.id);
        res.status(200).send(userData);
    }),
    createImagePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { image, captions } = req.body;
        const post = yield Posts_1.default.create({
            userId: req.params.id,
            text: captions,
            image,
            date: Date.now()
        });
        const userData = yield User_1.default.findById(req.params.id);
        userData === null || userData === void 0 ? void 0 : userData.Posts.push(post === null || post === void 0 ? void 0 : post._id);
        yield (userData === null || userData === void 0 ? void 0 : userData.save());
        res.status(200).send({ status: true });
    }),
    getUserPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        User_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(req.params.id)
                }
            }, {
                $project: {
                    Posts: 1
                }
            }, {
                $unwind: {
                    path: '$Posts'
                }
            }, {
                $project: {
                    _id: 0
                }
            }, {
                $lookup: {
                    from: 'imageposts',
                    localField: 'Posts',
                    foreignField: '_id',
                    as: 'posts'
                }
            }, {
                $project: {
                    posts: { $arrayElemAt: ['$posts', 0] }
                }
            }
        ]).sort({ date: -1 }).then(data => {
            res.status(200).send(data);
        }).catch(err => res.json(err));
    }),
    fetchFollowersPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userPosts = yield Posts_1.default.find().populate('userId').sort({ date: -1 });
        res.status(200).send(userPosts);
    }),
    fetchSpecificUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userData = yield User_1.default.findOne({ _id: req.params.id });
            res.status(200).send(userData);
        }
        catch (error) {
            res.send(error);
        }
    }),
    getLikePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const postId = req.params.postId;
            const post = yield Posts_1.default.findById(postId);
            if (!(post)) {
                return res.json({ Message: 'post not fount', success: false });
            }
            if (!(post.likes.includes(userId))) {
                yield post.updateOne({ $push: { likes: userId } });
                return res.json({ Message: 'post liked successfully', success: true });
            }
            else {
                yield post.updateOne({ $pull: { likes: userId } });
                return res.json({ Message: 'post disliked successfully', success: true });
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }),
    getFollowUer: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = req.params.userId;
            const myId = req.params.myId;
            const userData = yield User_1.default.findById(userId);
            const myData = yield User_1.default.findById(myId);
            if (userData) {
                if (myData) {
                    if ((_a = userData === null || userData === void 0 ? void 0 : userData.followers) === null || _a === void 0 ? void 0 : _a.includes(myId)) {
                        yield userData.updateOne({ $pull: { followers: myData === null || myData === void 0 ? void 0 : myData._id } });
                        yield myData.updateOne({ $pull: { following: userData === null || userData === void 0 ? void 0 : userData._id } });
                        res.send({ message: 'unFollow', status: true });
                    }
                    else {
                        yield userData.updateOne({ $push: { followers: myData === null || myData === void 0 ? void 0 : myData._id } });
                        yield myData.updateOne({ $push: { following: userData === null || userData === void 0 ? void 0 : userData._id } });
                        res.send({ message: 'follow', status: true });
                    }
                }
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }),
    editProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { _id: userId, first_name: firstName, last_name: lastName, picture, cover, username, country, place, about } = req.body;
            const response = yield User_1.default.findByIdAndUpdate(userId, {
                first_name: firstName,
                last_name: lastName,
                picture,
                cover,
                username,
                country,
                place,
                about
            });
            if (response != null) {
                res.status(201)
                    .send({ status: true, message: 'profile update finished' });
            }
            else {
                res.send({ status: false, message: 'something went wrong' });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    getAddCommentToPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, postId, comment } = req.body;
        const commentRes = yield Comments_1.default.create({
            userId,
            postId,
            comment
        });
        res.status(200).send({ data: commentRes, status: true, message: 'comment Added' });
    }),
    getAllCommentToPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postId = req.params.postId;
            const commentData = yield Comments_1.default.find({ postId }).populate('userId');
            if (commentData) {
                res.status(200).send(commentData);
            }
            else {
                res.send({ err: true });
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }),
    getUserFollowers: (req, res) => {
        try {
            User_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(req.params.userId)
                    }
                }, {
                    $project: {
                        followers: 1
                    }
                }, {
                    $unwind: {
                        path: '$followers'
                    }
                }, {
                    $project: {
                        _id: 0
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        localField: 'followers',
                        foreignField: '_id',
                        as: 'followers'
                    }
                },
                {
                    $project: {
                        followers: { $arrayElemAt: ['$followers', 0] }
                    }
                }
            ]).then(data => {
                res.status(200).send(data);
            }).catch(err => res.json(err));
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    getUserFollowing: (req, res) => {
        try {
            User_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(req.params.userId)
                    }
                }, {
                    $project: {
                        following: 1
                    }
                }, {
                    $unwind: {
                        path: '$following'
                    }
                }, {
                    $project: {
                        _id: 0
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        localField: 'following',
                        foreignField: '_id',
                        as: 'following'
                    }
                },
                {
                    $project: {
                        following: { $arrayElemAt: ['$following', 0] }
                    }
                }
            ]).then(data => {
                res.status(200).send(data);
            }).catch(err => res.json(err));
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    userLogout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.default.findById(req.params.userId);
            if (user) {
                user.isLogged = false;
                yield user.save();
                res.status(200).send({ status: true, message: 'logged out' });
            }
            else {
                res.send({ err: true });
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }),
    postUserSearch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { searchData: searchExpression } = req.body;
            const searchData = yield User_1.default.find({ username: { $regex: searchExpression, $options: 'i' } });
            if (searchData) {
                res.status(200).json(searchData);
            }
            else {
                res.status(404).json({ noUsers: true });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const user = yield User_1.default.findOne({ email });
            if (user) {
                const userToken = new Token_1.default({
                    userId: user._id,
                    token: crypto_1.default.randomBytes(32).toString('hex')
                });
                yield userToken.save();
                const Url = `${process.env.BASE_URL}/${user.id}/changePassword/${userToken.token}`;
                void (0, sentEmail_1.default)(user.email, 'Click Link and change password', Url);
                res.status(200).send({ status: true, message: 'email sent successfully' });
            }
            else {
                res.json({ status: false, message: 'user not Found' });
            }
        }
        catch (error) {
            res.status(500).json({ error, internalError: true, message: 'Internal error' });
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, token, newPassword } = req.body;
            const tokenData = yield Token_1.default.findOne({ token });
            if (tokenData === null) {
                res.json({ message: 'Invalid token', tokenErr: true });
            }
            else {
                const user = yield User_1.default.findById(userId);
                const hashPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
                if (user) {
                    user.password = hashPassword;
                    yield user.save();
                    yield Token_1.default.deleteOne({ token, userId });
                    res.status(200).send({ message: 'Password changed', status: true });
                }
                else {
                    res.status(403).send({ status: false, message: 'user not found' });
                }
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    savePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const { postId } = req.body;
            const user = yield User_1.default.findById(userId);
            if (user) {
                if (!user.saved.includes(postId)) {
                    yield user.updateOne({ $push: { saved: new mongoose_1.default.Types.ObjectId(postId) } });
                    res.json({ Message: 'post saved successfully', success: true, saved: true });
                }
                else {
                    yield user.updateOne({ $pull: { saved: new mongoose_1.default.Types.ObjectId(postId) } });
                    res.json({ Message: 'post unsaved successfully', success: true, unsaved: true });
                }
            }
            else {
                res.json({ noUser: true });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    getSavedPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const result = yield User_1.default.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.default.Types.ObjectId(userId)
                    }
                }, {
                    $project: {
                        saved: 1
                    }
                }, {
                    $unwind: {
                        path: '$saved'
                    }
                }, {
                    $project: {
                        _id: 0
                    }
                }, {
                    $lookup: {
                        from: 'imageposts',
                        localField: 'saved',
                        foreignField: '_id',
                        as: 'saved'
                    }
                }, {
                    $project: {
                        saved: { $arrayElemAt: ['$saved', 0] }
                    }
                }, {
                    $project: {
                        'saved._id': 1,
                        'saved.image': 1
                    }
                }
            ]);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    getSinglePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { postId } = req.params;
            const result = yield Posts_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(postId) }).populate('userId');
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(404).json({ noPost: true });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    createQrCode: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const profileUrl = `${process.env.BASE_URL}/profile/${req.params.userId}`;
            const profileQrUrl = yield qrcode_1.default.toDataURL(profileUrl);
            res.status(200).json({ profileQrUrl, profileUrl });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    googleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userData = yield User_1.default.findOne({ email: req.body.email, googleAuth: true });
            if (userData) {
                const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: userData._id.toString() }, '30m');
                res.status(200).json({ token: jwtVerificationToken, id: userData._id, authStatus: true });
            }
            else {
                res.status(200).json({ userData, authStatus: false });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    googleSignup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userData = yield User_1.default.findOne({ email: req.body.email, googleAuth: true });
            if (userData) {
                res.status(200).json({ alreadyRegistered: true });
            }
            else {
                const result = yield User_1.default.create({
                    email: req.body.email,
                    first_name: req.body.name,
                    username: req.body.name,
                    picture: req.body.picture,
                    googleAuth: true
                });
                const jwtVerificationToken = (0, jsonwebtoken_1.generateToken)({ id: result._id.toString() }, '30m');
                res.status(200).json({ token: jwtVerificationToken, id: result._id, authStatus: true });
            }
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    uploadVideo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { url, userId, captions } = req.body;
        try {
            const newShort = new VideoPost_1.default({
                url,
                userId,
                captions
            });
            yield newShort.save();
            res
                .status(201)
                .json({ status: true, message: 'Short added successfully' });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    allVideos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allShorts = yield VideoPost_1.default
                .find()
                .populate('userId')
                .sort({ createdAt: -1 });
            res.status(200).json(allShorts);
        }
        catch (error) {
            res.status(500).json(error);
        }
    })
};
