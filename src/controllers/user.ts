import { Response, Request } from "express"
import User from '../models/User'
import Token from '../models/Token'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateToken } from '../utils/jsonwebtoken'
import sendEmail from '../utils/sentEmail'
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
                res.json({ message: "username Exist", userNameExist: true })
            }
            const emailExist = await User.findOne({ email })
            if (emailExist) {
                res.send({ message: "Email Exist", emailExist: true })
            } else {
                const user = await new User({
                    first_name,
                    last_name,
                    username,
                    email,
                    password: await bcrypt.hash(password, saltRounds)
                }).save();

                const userToken = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();

                const Url = `${process.env.BASE_URL}${user.id}/verify/${userToken.token}`;
                sendEmail(user.email, "verify Email", Url);

                res.status(200).send({ sendEmail: true })

            }
        } catch (error) {
            res.status(500).json({ message: error })
        }
    },
    postLogin: async (req: Request, res: Response) => {
        const { email, password }: { email: string, password: string } = req.body
        const userData = await User.findOne({ email })
        if (!userData) {
            res.json({ message: "This email don't have any account", emailError: true })
        } else {
            const passwordVerify: boolean = await bcrypt.compare(password, userData?.password)
            if (passwordVerify) {
                const jwtVerificationToken = generateToken({ id: userData._id.toString() }, '30m')
                res.status(200).cookie("userAuthentication", jwtVerificationToken, {
                    httpOnly: false,
                    maxAge: 600 * 1000,
                }).json({ message: "login success", success: true })
            } else {
                res.json({ message: "Wrong Password", passwordError: true })
            }

        }
    },
    verifyEmail: async (req: Request, res: Response) => {
        const Verify: { Status: Boolean; message: string } = {
            Status: false,
            message: "",

        };
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) return res.status(400).send("Invalid link");
            const tokenData = await Token.findOne({
                userId: user._id,
                Token: req.params.token,
            });

            Verify.message = "Invalid link";
            if (!Token) return res.status(400).send(Verify);

            await User.updateOne({ _id: user._id, verified: true });
            await Token.findByIdAndRemove(tokenData?._id);
            Verify.Status = true;
            Verify.message = "email verified successful";
            const jwtVerificationToken = generateToken({ id: user._id.toString() }, '30m')
            let response = {
                jwtVerificationToken,
                Verify
            }
            res.cookie("userAuthentication", jwtVerificationToken, {
                httpOnly: false,
                maxAge: 600 * 1000,
            }).status(200).send(response)
        } catch (error) {
            Verify.Status = false;
            Verify.message = "An error occurred";
            res.status(400).send(Verify);
        }
    }
}