import { UpdateAccountDTO } from '../dto/accountDTO';
import ApiError from '../errorCustom/apiError';
import { Transaction } from 'sequelize';

const db = require('../../database/index');
const account = db.account;

async function createAccount(
   userId: number,
   accountName: string,
   securitiesCompanyId: number,
   option?: { transaction?: Transaction },
) {
   const { transaction } = option || {};
   const data = await account.create(
      {
         user_id: userId,
         account_name: accountName,
         securities_company_id: securitiesCompanyId,
      },
      {
         transaction,
      },
   );
   return data;
}

async function readAccountById(accountId: number) {
   const data = await account.findOne({ where: { id: accountId }, raw: true });
   return data;
}

async function readAccountByUserId(userId: number) {
   const data = await account.findAll({ where: { user_id: userId }, raw: true });
   return data;
}

async function updateAccount(accountId: number, updateAccountDTO: UpdateAccountDTO) {
   const data = await account.update(updateAccountDTO, { where: { id: accountId } });
   return data;
}

async function deleteAccount(accountId: number, option?: { transaction?: Transaction }) {
   const { transaction } = option || {};
   await account.destroy({ where: { id: accountId }, transaction });
}

module.exports = { createAccount, readAccountById, readAccountByUserId, updateAccount, deleteAccount };
