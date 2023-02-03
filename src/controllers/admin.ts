/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Admin from '../models/Admin'
import { Request, Response } from 'express'
import { generateToken } from '../utils/jsonwebtoken'
import User from '../models/User'

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password }: { email: string, password: string } = req.body
  const adminData = await Admin.findOne({ email })
  if (adminData == null) {
    res.json({ message: "This email don't have any account", emailError: true })
  } else {
    // const passwordVerify: boolean = await bcrypt.compare(password, adminData?.password)
    const passwordVerify: boolean = password === adminData?.password
    if (passwordVerify) {
      const jwtVerificationToken = generateToken({ id: adminData._id.toString() }, '30m')
      res.status(200).cookie('userAuthentication', jwtVerificationToken, {
        httpOnly: false,
        maxAge: 600 * 1000
      }).json({ message: 'login success', success: true, token: jwtVerificationToken, id: adminData?._id })
    } else {
      res.json({ message: 'Wrong Password', passwordError: true })
    }
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
    if (users !== null) {
      res.status(200).json(users)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getIsBlocked = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
    if (user !== null) {
      if (!user?.isBlocked) {
        user.isBlocked = true
        void user.save()
        res.status(200).json({ userBlocked: true })
      } else {
        user.isBlocked = false
        void user.save()
        res.status(200).json({ userUnBlocked: true })
      }
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getActiveInactiveUsers = async (req: Request, res: Response) => {
  try {
    const activeUsersInactive = await User.aggregate([
      { $match: { isLogged: false } }
    ])
    res.json(activeUsersInactive)
  } catch (error) {
    res.status(500).json(error)
  }
}
