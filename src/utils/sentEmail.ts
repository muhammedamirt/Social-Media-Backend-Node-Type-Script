import { config } from 'dotenv'
config()
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject,
      text
    })
    console.log('email sent success full')
  } catch (error) {
    console.log(error)
  }
}

export default sendEmail
