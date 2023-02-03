/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import { cancelReport, reportPost } from '../controllers/reportPostController'
const router: Router = express.Router()

router.post('/', reportPost)
router.put('/cancel-report', cancelReport)
export default router
