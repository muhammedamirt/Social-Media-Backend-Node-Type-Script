"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
// import jwtAuth from '../middlewares/authrization'
const router = express_1.default.Router();
router.get('/', user_1.default.getHome);
router.post('/register', user_1.default.postRegister);
router.post('/login', user_1.default.postLogin);
router.get('/verifySignup/:id/:token', user_1.default.verifyEmail);
router.post('/imageUpload', user_1.default.postImageUpload);
router.get('/getUserData/:id', user_1.default.getUserData);
router.post('/createImagePost/:id', user_1.default.createImagePost);
router.get('/getUserPosts/:id', user_1.default.getUserPosts);
router.get('/fetchFollowersPosts/:id', user_1.default.fetchFollowersPosts);
router.get('/fetchSpecificUser/:id', user_1.default.fetchSpecificUser);
router.get('/LikePost/:postId/:userId', user_1.default.getLikePost);
router.get('/followUser/:userId/:myId', user_1.default.getFollowUer);
router.post('/editProfile', user_1.default.editProfile);
router.post('/commentToPost', user_1.default.getAddCommentToPost);
router.get('/getComments/:postId', user_1.default.getAllCommentToPost);
router.get('/getUserFollowers/:userId', user_1.default.getUserFollowers);
router.get('/getUserFollowing/:userId', user_1.default.getUserFollowing);
router.put('/logout/:userId', user_1.default.userLogout);
router.post('/searchUser/', user_1.default.postUserSearch);
router.put('/forgotPassword', user_1.default.forgotPassword);
router.put('/changePassword', user_1.default.changePassword);
router.put('/savePost/:userId', user_1.default.savePost);
router.get('/fetchSavedPosts/:userId', user_1.default.getSavedPost);
router.get('/onePost/:postId', user_1.default.getSinglePost);
// router.get('/qrCode/:userId', controllers.createQrCode)
router.post('/googleLogin', user_1.default.googleLogin);
router.post('/googleSignup', user_1.default.googleSignup);
router.post('/uploadVideoFile', user_1.default.uploadVideo);
router.get('/getAllVideos', user_1.default.allVideos);
exports.default = router;
