import { Response, Request } from "express"
import User from '../models/User'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jsonwebtoken'
const saltRounds: number = 10

export default {
    getHome: (req: Request, res: Response) => {
        res.status(200).send({ status: true })
    },
    postRegister: async (req: Request, res: Response) => {
        try {
            console.log(req.body);

            const {
                first_name,
                last_name,
                username,
                email,
                password } = req.body
            const userNameExist = await User.findOne({ username })
            if (userNameExist) {
                res.json({ message: "username Exist" })
            }
            const emailExist = await User.findOne({ email })
            if (emailExist) {
                res.send({ message: "Email Exist" })
            } else {
                const user = await new User({
                    first_name,
                    last_name,
                    username,
                    email,
                    password: await bcrypt.hash(password, saltRounds)
                }).save();
                const jwtVerificationToken = generateToken({ id: user._id.toString() }, '30m')
                console.log(jwtVerificationToken);
                res.status(200).json(user)
            }
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },
    postLogin: async (req: Request, res: Response) => {
        const { email, password }: { email: string, password: string } = req.body
        const userData = await User.findOne({ email })
        if (!userData) {
            res.json({ message: "Account doesn't Exist" })
        } else {
            const passwordVerify: boolean = await bcrypt.compare(password, userData?.password)
            if (passwordVerify) {
                res.status(200).json({ message: "login success" })
            } else {
                res.json({ message: "Wrong Password" })
            }

        }
    }
}