import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../modules/api.error";

const stockService = require("../services/stockService");


async function getTokenController(req: Request, res: Response) {
  try {
    const access_token = await stockService.getTokenService();
    return res.status(StatusCodes.OK).send({ access_token });
  } catch (error) {
    const err = error as ApiError;
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function readKRCurrentPriceController(req: Request, res: Response) {
    try {
      const itemCode : string = req.params.id;
      const data = await stockService.readKRCurrentPriceService(itemCode);
      return res.status(StatusCodes.OK).send({ data });
    } catch (error) {
      const err = error as ApiError;
      console.log(err);
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
}

async function readUSCurrentPriceController(req: Request, res: Response) {
    try {
      const itemCode : string = req.params.id;
      const data = await stockService.readUSCurrentPriceService(itemCode);
      return res.status(StatusCodes.OK).send({ data });
    } catch (error) {
      const err = error as ApiError;
      console.log(err);
      return res.status(err.statusCode || 500).json({ message: err.message });
    }
}


module.exports = {
    getTokenController,
    readKRCurrentPriceController,
    readUSCurrentPriceController
};
