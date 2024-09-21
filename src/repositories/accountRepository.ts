import { updateAccountDTO } from '../dto/accountDTO';

const db = require('../../database/index');
const account = db.account;

async function createAccount(accountName: string, userId: number) {
   const data = await account.create({
      account_name: accountName,
      user_id: userId,
   });
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

async function updateAccount(accountId: number, updateAccountDTO: updateAccountDTO) {
   const data = await account.update(updateAccountDTO, { where: { id: accountId } });
   return data;
}
module.exports = { createAccount, readAccountById, readAccountByUserId, updateAccount };
