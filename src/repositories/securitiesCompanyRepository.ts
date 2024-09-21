const db = require('../../database/index');
const securitiesCompany = db.securitiesCompany;

async function readSecuritiesCompanyById(securitiesCompanyId: number) {
   const data = await securitiesCompany.findOne({ where: { id: securitiesCompanyId }, raw: true });
   return data;
}

module.exports = { readSecuritiesCompanyById };
