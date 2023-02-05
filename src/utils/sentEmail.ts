import { config } from 'dotenv'
config()
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
// const { google } = require('googleapis');
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: process.env.HOST,
    //   service: process.env.SERVICE,
    //   port: 587,
    //   secure: true,
    //   auth: {
    //     user: process.env.USER,
    //     pass: process.env.PASS
    //   }
    // })

    // const oauth2Client = new google.auth.OAuth2(
    //   process.env.GOOGLE_CLIENT_ID,
    //   process.env.GOOGLE_CLIENT_SECRET_ID,
    //   'https://www.wouldoback.iworldecart.shop'
    // )
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET_ID
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
