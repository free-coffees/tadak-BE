import { Transaction } from 'sequelize';

const db = require('../../database/index');
const holding = db.holding;

async function createHolding(accountId: number, stockId: number, option?: { transaction?: Transaction }) {
   const { transaction } = option || {};
   const data = await holding.create(
      {
         account_id: accountId,
         stock_id: stockId,
         quantity: 0,
         average_price: 0,
      },
      { transaction },
   );
   return data;
}

async function readHoldingByAccountIdAndStockId(accountId: number, stockId: number) {
   const data = await holding.findOne({ where: { account_id: accountId, stock_id: stockId }, raw: true });
   return data;
}

async function readHoldingByAccountId(accountId: number) {
   const data = await holding.findAll({ where: { account_id: accountId }, raw: true });
   return data;
}

async function updateHolding(
   accountId: number,
   stockId: number,
   quantity: number,
   avgPrice: number,
   status?: string,
   option?: { transaction?: Transaction },
) {
   const { transaction } = option || {};
   const updatedData: any = {
      quantity: quantity,
      average_price: avgPrice,
   };
   if (status !== undefined) {
      updatedData.status = status;
   }
   const data = await holding.update(updatedData, {
      where: {
         account_id: accountId,
         stock_id: stockId,
      },
      transaction,
   });
   return data;
}

async function deleteHolding(accountId: number, stockId: number, option?: { transaction?: Transaction }) {
   const { transaction } = option || {};
   const data = await holding.destroy({
      where: {
         account_id: accountId,
         stock_id: stockId,
      },
      transaction,
   });
   return data;
}

module.exports = {
   createHolding,
   readHoldingByAccountIdAndStockId,
   readHoldingByAccountId,
   updateHolding,
   deleteHolding,
};
