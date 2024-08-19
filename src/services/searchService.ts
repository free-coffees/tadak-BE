import ApiError from '../errorCuston.ts/apiError';

const searchRepo = require('../repositories/searchRepository');
const stockRepo = require('../repositories/stockRepository');

async function getSearchListService(searchWord: string, page: number) {
   const searchList = await searchRepo.readSearchList(searchWord, page);
   return searchList;
}

async function updateSearchFrequencyService(stock_id: number) {
   const isExistedSearchFrequency = await searchRepo.readSearchFrequency(stock_id);
   if (isExistedSearchFrequency) {
      await searchRepo.updateSearchFrequency(stock_id);
   } else {
      await searchRepo.createSearchFrequency(stock_id);
   }
}

module.exports = { getSearchListService, updateSearchFrequencyService };
