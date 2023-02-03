/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable eqeqeq */
import { Response, Request } from 'express'
import User from '../models/User'
import Token from '../models/Token'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import PostImages from '../models/Posts'
import { generateToken } from '../utils/jsonwebtoken'
import sendEmail from '../utils/sentEmail'
import mongoose from 'mongoose'
import Comments from '../models/Comments'
import VideoModel from '../models/VideoPost'
import QRCode from 'qrcode'
const saltRounds: number = 10

export default {
  getHome: (req: Request, res: Response) => {
    res.status(200).send({ status: true })
  },
  postRegister: async (req: Request, res: Response) => {
    try {
      const {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password
      } = req.body
      // const userNameExist = await User.findOne({ username })
      // if (userNameExist != null) {
      //   res.send({ message: 'username Exist', userNameExist: true })
      // }
      const emailExist = await User.findOne({ email })
      if (emailExist != null) {
        res.send({ message: 'Email Exist', emailExist: true })
      } else {
        const user = await new User({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password: await bcrypt.hash(password, saltRounds)
        }).save()

        const userToken = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex')
        }).save()

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const Url: string = `${process.env.BASE_URL}/${user.id}/verify/${userToken.token}`
        void sendEmail(user.email, 'verify Email', Url)

        res.status(200).send({ sendEmail: true })
      }
    } catch (error) {
      res.status(500).json({ message: error })
    }
  },
  postLogin: async (req: Request, res: Response) => {
    const { email, password }: { email: string, password: string } = req.body
    const userData = await User.findOne({ email })
    if (userData == null) {
      res.json({ message: "This email don't have any account", emailError: true })
    } else {
      const passwordVerify: boolean = await bcrypt.compare(password, userData?.password)
      if (passwordVerify) {
        userData.isLogged = true
        await userData.save()
        const jwtVerificationToken = generateToken({ id: userData._id.toString() }, '30m')
        res.status(200).cookie('userAuthentication', jwtVerificationToken, {
          httpOnly: false,
          maxAge: 600 * 1000
        }).json({ message: 'login success', success: true, token: jwtVerificationToken, id: userData?._id })
      } else {
        res.json({ message: 'Wrong Password', passwordError: true })
      }
    }
  },
  verifyEmail: async (req: Request, res: Response) => {
    const Verify: { Status: Boolean, message: string } = {
      Status: false,
      message: ''
    }
    try {
      const user = await User.findOne({ _id: req.params.id })
      if (user == null) return res.status(400).send('Invalid link')
      const tokenData = await Token.findOne({
        userId: user._id,
        Token: req.params.token
      })
      Verify.message = 'Invalid link'
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!Token) return res.status(400).send(Verify)
      await User.updateOne({ _id: user._id }, { verified: true })
      await Token.findByIdAndRemove(tokenData?._id)
      Verify.Status = true
      Verify.message = 'email verified successful'
      const jwtVerificationToken = generateToken({ id: user._id.toString() }, '30m')
      const response = {
        jwtVerificationToken,
        Verify
      }
      res.cookie('userAuthentication', jwtVerificationToken, {
        httpOnly: false,
        maxAge: 600 * 1000
      }).status(200).send(response)
    } catch (error) {
      Verify.Status = false
      Verify.message = 'An error occurred'
      res.status(500).send(error)
    }
  },
  postImageUpload: (req: Request, res: Response) => {
  },
  getUserData: async (req: Request, res: Response) => {
    const userData = await User.findById(req.params.id)
    res.status(200).send(userData)
  },
  createImagePost: async (req: Request, res: Response) => {
    const { image, captions }: { image: string, captions: string } = req.body
    const post = await PostImages.create({
      userId: req.params.id,
      text: captions,
      image,
      date: Date.now()
    })
    const userData = await User.findById(req.params.id)
    userData?.Posts.push(post?._id)
    await userData?.save()
    res.status(200).send({ status: true })
  },
  getUserPosts: async (req: Request, res: Response) => {
    User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
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
      res.status(200).send(data)
    }).catch(err => res.json(err))
  },
  fetchFollowersPosts: async (req: Request, res: Response) => {
    const userPosts = await PostImages.find().populate('userId').sort({ date: -1 })
    res.status(200).send(userPosts)
  },
  fetchSpecificUser: async (req: Request, res: Response) => {
    try {
      const userData = await User.findOne({ _id: req.params.id })
      res.status(200).send(userData)
    } catch (error) {
      res.send(error)
    }
  },
  getLikePost: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId
      const postId = req.params.postId
      const post = await PostImages.findById(postId)
      if (!(post)) {
        return res.json({ Message: 'post not fount', success: false })
      }
      if (!(post.likes.includes(userId))) {
        await post.updateOne({ $push: { likes: userId } })
        return res.json({ Message: 'post liked successfully', success: true })
      } else {
        await post.updateOne({ $pull: { likes: userId } })
        return res.json({ Message: 'post disliked successfully', success: true })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getFollowUer: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId
      const myId = req.params.myId
      const userData = await User.findById(userId)
      const myData = await User.findById(myId)
      if (userData) {
        if (myData) {
          if (userData?.followers?.includes(myId)) {
            await userData.updateOne({ $pull: { followers: myData?._id } })
            await myData.updateOne({ $pull: { following: userData?._id } })
            res.send({ message: 'unFollow', status: true })
          } else {
            await userData.updateOne({ $push: { followers: myData?._id } })
            await myData.updateOne({ $push: { following: userData?._id } })
            res.send({ message: 'follow', status: true })
          }
        }
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  editProfile: async (req: Request, res: Response) => {
    try {
      const {
        _id: userId,
        first_name: firstName,
        last_name: lastName,
        picture,
        cover,
        username,
        country,
        place,
        about
      } = req.body
      const response = await User.findByIdAndUpdate(userId, {
        first_name: firstName,
        last_name: lastName,
        picture,
        cover,
        username,
        country,
        place,
        about
      })
      if (response != null) {
        res.status(201)
          .send({ status: true, message: 'profile update finished' })
      } else {
        res.send({ status: false, message: 'something went wrong' })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  getAddCommentToPost: async (req: Request, res: Response) => {
    const { userId, postId, comment } = req.body
    const commentRes = await Comments.create({
      userId,
      postId,
      comment
    })
    res.status(200).send({ data: commentRes, status: true, message: 'comment Added' })
  },
  getAllCommentToPost: async (req: Request, res: Response) => {
    try {
      const postId: any = req.params.postId
      const commentData = await Comments.find({ postId }).populate('userId')
      if (commentData) {
        res.status(200).send(commentData)
      } else {
        res.send({ err: true })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getUserFollowers: (req: Request, res: Response) => {
    try {
      User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.userId)
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
        res.status(200).send(data)
      }).catch(err => res.json(err))
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getUserFollowing: (req: Request, res: Response) => {
    try {
      User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(req.params.userId)
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
        res.status(200).send(data)
      }).catch(err => res.json(err))
    } catch (err) {
      res.status(500).json(err)
    }
  },
  userLogout: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.userId)
      if (user) {
        user.isLogged = false
        await user.save()
        res.status(200).send({ status: true, message: 'logged out' })
      } else {
        res.send({ err: true })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  postUserSearch: async (req: Request, res: Response) => {
    try {
      const { searchData: searchExpression } = req.body
      const searchData = await User.find({ username: { $regex: searchExpression, $options: 'i' } })
      if (searchData) {
        res.status(200).json(searchData)
      } else {
        res.status(404).json({ noUsers: true })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body
      const user = await User.findOne({ email })
      if (user) {
        const userToken = new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex')
        })
        await userToken.save()
        const Url: string | undefined = `${process.env.BASE_URL}/${user.id}/changePassword/${userToken.token}`
        void sendEmail(user.email, 'Click Link and change password', Url)
        res.status(200).send({ status: true, message: 'email sent successfully' })
      } else {
        res.json({ status: false, message: 'user not Found' })
      }
    } catch (error) {
      res.status(500).json({ error, internalError: true, message: 'Internal error' })
    }
  },
  changePassword: async (req: Request, res: Response) => {
    try {
      const { userId, token, newPassword } = req.body
      const tokenData = await Token.findOne({ token })
      if (tokenData === null) {
        res.json({ message: 'Invalid token', tokenErr: true })
      } else {
        const user = await User.findById(userId)
        const hashPassword = await bcrypt.hash(newPassword, saltRounds)
        if (user) {
          user.password = hashPassword
          await user.save()
          await Token.deleteOne({ token, userId })
          res.status(200).send({ message: 'Password changed', status: true })
        } else {
          res.status(403).send({ status: false, message: 'user not found' })
        }
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  savePost: async (req: Request, res: Response) => {
    try {
      const userId: string = req.params.userId
      const { postId } = req.body
      const user = await User.findById(userId)
      if (user) {
        if (!user.saved.includes(postId)) {
          await user.updateOne({ $push: { saved: new mongoose.Types.ObjectId(postId) } })
          res.json({ Message: 'post saved successfully', success: true, saved: true })
        } else {
          await user.updateOne({ $pull: { saved: new mongoose.Types.ObjectId(postId) } })
          res.json({ Message: 'post unsaved successfully', success: true, unsaved: true })
        }
      } else {
        res.json({ noUser: true })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  getSavedPost: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId
      const result = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId)
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
      ])
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  getSinglePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params
      const result = await PostImages.findOne({ _id: new mongoose.Types.ObjectId(postId) }).populate('userId')
      if (result) {
        res.status(200).json(result)
      } else {
        res.status(404).json({ noPost: true })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  createQrCode: async (req: Request, res: Response) => {
    try {
      const profileUrl = `${process.env.BASE_URL}/profile/${req.params.userId}`
      const profileQrUrl = await QRCode.toDataURL(profileUrl)
      res.status(200).json({ profileQrUrl, profileUrl })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const userData = await User.findOne({ email: req.body.email, googleAuth: true })
      if (userData) {
        const jwtVerificationToken = generateToken({ id: userData._id.toString() }, '30m')
        res.status(200).json({ token: jwtVerificationToken, id: userData._id, authStatus: true })
      } else {
        res.status(200).json({ userData, authStatus: false })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  googleSignup: async (req: Request, res: Response) => {
    try {
      const userData = await User.findOne({ email: req.body.email, googleAuth: true })
      if (userData) {
        res.status(200).json({ alreadyRegistered: true })
      } else {
        const result = await User.create({
          email: req.body.email,
          first_name: req.body.name,
          username: req.body.name,
          picture: req.body.picture,
          googleAuth: true
        })
        const jwtVerificationToken = generateToken({ id: result._id.toString() }, '30m')
        res.status(200).json({ token: jwtVerificationToken, id: result._id, authStatus: true })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  uploadVideo: async (req: Request, res: Response) => {
    const { url, userId, captions } = req.body
    try {
      const newShort = new VideoModel({
        url,
        userId,
        captions
      })
      await newShort.save()
      res
        .status(201)
        .json({ status: true, message: 'Short added successfully' })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  allVideos: async (req: Request, res: Response) => {
    try {
      const allShorts = await VideoModel
        .find()
        .populate('userId')
        .sort({ createdAt: -1 })
      res.status(200).json(allShorts)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
