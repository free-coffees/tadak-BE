import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../errorCustom/apiError';
import { CreateTransferDTO, UpdateTransferDTO } from '../dto/transferDTO';

const transferService = require('../services/transferService');

async function createTransferController(req: Request, res: Response) {
   try {
      const createTransferDTO: CreateTransferDTO = req.body;
      await transferService.createTransferService(createTransferDTO);
      return res.status(StatusCodes.OK).send({ message: '입출금이 정상적으로 처리 되었습니다.' });
   } catch (error) {
      console.error('Transfer Error:', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function updateTransferController(req: Request, res: Response) {
   try {
      const updateTransferDTO: UpdateTransferDTO = req.body;
      await transferService.updateTransferService(updateTransferDTO);
      return res.status(StatusCodes.OK).send({ message: '기록이 수정 됐어요.' });
   } catch (error) {
      console.error('Transfer Update Error:', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

async function deleteTransferController(req: Request, res: Response) {
   try {
      const transferId = req.body.transferId;
      const userId = req.userId;
      await transferService.deleteTransferService(userId, transferId);
      return res.status(StatusCodes.OK).send({ message: '선택 기록이 삭제됐어요.' });
   } catch (error) {
      console.error('Transfer Deletion Error:', error);
      if (error instanceof ApiError) {
         return res.status(error.statusCode).json({ message: error.message });
      } else {
         return res.status(500).json({ message: 'Internal Server Error' });
      }
   }
}

module.exports = { createTransferController, updateTransferController, deleteTransferController };
