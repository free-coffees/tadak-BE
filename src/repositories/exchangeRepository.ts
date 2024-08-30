import { Transaction } from 'sequelize';
import { createExchangeDTO } from '../dto/exchangeDTO';

const db = require('../../database/index');
const exchange = db.exchange;

async function createExchange(
   createExchangeDTO: createExchangeDTO,
   exchangedAmount: number,
   option?: { transaction?: Transaction },
) {
   const { accountId, exchangeDate, fromCurrency, toCurrency, exchangeRate, amount } = createExchangeDTO;
   const { transaction } = option || {};
   const data = await exchange.create(
      {
         account_id: accountId,
         exchange_date: exchangeDate,
         from_currency: fromCurrency,
         to_currency: toCurrency,
         exchange_rate: exchangeRate,
         amount: amount,
         exchanged_amount: exchangedAmount,
      },
      {
         transaction,
      },
   );
   return data;
}

module.exports = { createExchange };
