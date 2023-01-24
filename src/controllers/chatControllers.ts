/* eslint-disable @typescript-eslint/explicit-function-return-type */
import ChatModel from '../models/Chat'
import { Request, Response } from 'express'

export const createChat = async (req: Request, res: Response) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId]
  })
  try {
    const result = await newChat.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const userChats = async (req: Request, res: Response) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] }
    })
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const findChat = async (req: Request, res: Response) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] }
    })
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
}
