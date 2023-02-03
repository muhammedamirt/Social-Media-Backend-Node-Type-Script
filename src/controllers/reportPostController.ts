/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from 'express'
import ReportsModel from '../models/Reports'

export const reportPost = async (req: Request, res: Response) => {
  const { userId, postId, reason } = req.body
  try {
    const report = new ReportsModel({
      userId,
      postId,
      reason
    })
    await report.save()
    res.status(201).json({ report, status: true })
  } catch (error: any) {
    res.status(error).json(error)
  }
}

export const cancelReport = async (req: Request, res: Response) => {
  const { userId, postId } = req.body
  try {
    const report = await ReportsModel.findOne({ userId, postId })
    if (report != null) {
      await report.deleteOne()
      res.status(200).json({ status: true, message: 'report deleted successfully' })
    } else {
      res.status(404).json({ status: false, message: 'no report found' })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
