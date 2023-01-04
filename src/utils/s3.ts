/* eslint-disable @typescript-eslint/explicit-function-return-type */
import aws from 'aws-sdk'
import dotenv from 'dotenv'
import crypto from 'crypto'
import { promisify } from 'util'
const randomBytes = promisify(crypto.randomBytes)
dotenv.config()

const region: string = 'ap-south-1'
const bucketName: string = 'woulddosocialmedia'
const accessKeyId: string | undefined = process.env.ACCESS_KEY_ID
const secretAccessKey: string | undefined = process.env.SECRET_ACCESS_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
})

export const generateUploadUrl = async () => {
  const rawBites = await randomBytes(16)
  const imageName: string = rawBites.toString('hex')
  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  const uploadUrl = await s3.getSignedUrlPromise('putObject', params)
  return uploadUrl
}
