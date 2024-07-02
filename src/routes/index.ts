import express from "express";
const stockRouter = require("./stockRouter");
const router = express.Router();

router.use(stockRouter);

module.exports = router;