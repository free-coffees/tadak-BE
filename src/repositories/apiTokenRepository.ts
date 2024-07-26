const db = require('../../database/index');
const sequelize = require('sequelize');

const apiToken = db.apiToken;

async function updateApiToken(token: string) {
   await apiToken.update({ access_token: token }, { where: { id: 1 } });
}

async function readApiToken() {
   const data = await apiToken.findOne({ where: { id: 1 }, raw: true });
   return data;
}

module.exports = { updateApiToken, readApiToken };
