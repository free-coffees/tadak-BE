import ApiError from '../errorCuston/apiError';

const searchRepo = require('../repositories/searchRepository');
const stockRepo = require('../repositories/stockRepository');

async function getSearchListService(searchWord: string, page: number) {
   const searchList = await searchRepo.readSearchList(searchWord, page);
   return searchList;
}

async function updateSearchFrequencyService(stockId: number) {
   const isExistedSearchFrequency = await searchRepo.readSearchFrequency(stockId);
   if (isExistedSearchFrequency) {
      await searchRepo.updateSearchFrequency(stockId);
   } else {
      await searchRepo.createSearchFrequency(stockId);
   }
}

module.exports = { getSearchListService, updateSearchFrequencyService };
