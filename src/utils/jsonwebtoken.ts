/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken = (payload: { id: string }, expired: string) => {
  return jwt.sign(payload, <string>process.env.SECRET_TOKEN, {
    expiresIn: expired
  })
}
