/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
dotenv.config()

export default async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body, '===1')

  try {
    const authHeader = req.headers.authorization
    interface ITokenPayload {
      iat: number
      exp: number
      id: string
    }
    if (authHeader == null) {
      return res.status(401).send({
        message: 'auth failed',
        Status: false
      })
    }
    const [, token] = authHeader.split(' ')
    jwt.verify(
      token,
      `${process.env.SECRET_TOKEN}`,
      (err, decoded) => {
        if (err != null) {
          return res.send({
            message: 'auth failed',
            Status: false
          })
        } else {
          const { id } = decoded as ITokenPayload
          req.body.userId = id
          next()
        }
      }
    )
  } catch (error) {
    console.log(error)

    return res.status(401).send({
      message: 'auth failed',
      success: false
    })
  }
}
