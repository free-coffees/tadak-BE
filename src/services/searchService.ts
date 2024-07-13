import ApiError from '../utils/api.error';

const searchRepo = require('../repositories/searchRepository');
const stockRepo = require('../repositories/stockRepository');

async function getSearchListService(searchWord: string) {
   const searchList = await searchRepo.readSearchList(searchWord);
   const isExistedStock = await stockRepo.readStockByName(searchWord);
   console.log(isExistedStock);
   if (isExistedStock) {
      const isExistedSearchFrequency = await searchRepo.readSearchFrequency(isExistedStock.id);
      if (isExistedSearchFrequency) {
         await searchRepo.updateSearchFrequency(isExistedStock.id);
      } else {
         await searchRepo.createSearchFrequency(isExistedStock.id);
      }
   }
   return searchList;
}

module.exports = { getSearchListService };
