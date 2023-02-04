/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import controllers from '../controllers/user'
// import jwtAuth from '../middlewares/authrization'
const router: Router = express.Router()

router.get('/', controllers.getHome)
router.post('/register', controllers.postRegister)
router.post('/login', controllers.postLogin)
router.get('/verifySignup/:id/:token', controllers.verifyEmail)
router.post('/imageUpload', controllers.postImageUpload)
router.get('/getUserData/:id', controllers.getUserData)
router.post('/createImagePost/:id', controllers.createImagePost)
router.get('/getUserPosts/:id', controllers.getUserPosts)
router.get('/fetchFollowersPosts/:id', controllers.fetchFollowersPosts)
router.get('/fetchSpecificUser/:id', controllers.fetchSpecificUser)
router.get('/LikePost/:postId/:userId', controllers.getLikePost)
router.get('/followUser/:userId/:myId', controllers.getFollowUer)
router.post('/editProfile', controllers.editProfile)
router.post('/commentToPost', controllers.getAddCommentToPost)
router.get('/getComments/:postId', controllers.getAllCommentToPost)
router.get('/getUserFollowers/:userId', controllers.getUserFollowers)
router.get('/getUserFollowing/:userId', controllers.getUserFollowing)
router.put('/logout/:userId', controllers.userLogout)
router.post('/searchUser/', controllers.postUserSearch)
router.put('/forgotPassword', controllers.forgotPassword)
router.put('/changePassword', controllers.changePassword)
router.put('/savePost/:userId', controllers.savePost)
router.get('/fetchSavedPosts/:userId', controllers.getSavedPost)
router.get('/onePost/:postId', controllers.getSinglePost)
// router.get('/qrCode/:userId', controllers.createQrCode)
router.post('/googleLogin', controllers.googleLogin)
router.post('/googleSignup', controllers.googleSignup)
router.post('/uploadVideoFile', controllers.uploadVideo)
router.get('/getAllVideos', controllers.allVideos)

export default router
