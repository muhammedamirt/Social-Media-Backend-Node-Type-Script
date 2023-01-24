/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import { adminLogin, getAllUsers, getIsBlocked } from '../controllers/admin'
const router: Router = express.Router()

router.post('/adminLogin', adminLogin)
router.get('/allUsers', getAllUsers)
router.put('/getIsBlocked/:userId', getIsBlocked)

export default router
