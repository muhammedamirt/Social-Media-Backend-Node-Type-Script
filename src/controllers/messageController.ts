/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from 'express'
import MessageModel from '../models/MessageModel'

export const addMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, text } = req.body
  const message = new MessageModel({
    chatId,
    senderId,
    text
  })
  try {
    const result = await message.save()
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getMessages = async (req: Request, res: Response): Promise<any> => {
  const { chatId } = req.params
  try {
    const result = await MessageModel.find({
      chatId
    })
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json(err)
  }
}
