/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import controllers from '../controllers/user'
const router: Router = express.Router()

router.get('/', controllers.getHome)
router.post('/register', controllers.postRegister)
router.post('/login', controllers.postLogin)
router.get('/verifySignup/:id/:token', controllers.verifyEmail)
router.post('/imageUpload', controllers.postImageUpload)

export default router
