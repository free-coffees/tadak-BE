const db = require('../../database/index');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const searchFrequency = db.searchFrequency;
const stock = db.stock;

async function readSearchList(searchWord: string) {
   const data = await stock.findAll({
      attributes: [
         ['id', 'stock_id'],
         'stock_code',
         'stock_name_kr',
         'stock_name_en',
         'market',
         [sequelize.col('search_frequency.frequency'), 'frequency'],
      ],
      where: {
         [Op.or]: [
            { stock_name_kr: { [Op.like]: '%' + searchWord + '%' } },
            { stock_name_en: { [Op.like]: '%' + searchWord + '%' } },
         ],
      },
      include: [
         {
            model: searchFrequency,
            as: 'search_frequency',
            attributes: [],
         },
      ],
      order: [['frequency', 'DESC']],
      raw: true,
   });

   return data;
}

async function updateSearchFrequency(stockId: number) {
   await searchFrequency.increment(
      { frequency: 1 },
      {
         where: {
            stock_id: stockId,
         },
      },
   );
}

async function readSearchFrequency(stockId: number) {
   const data = await searchFrequency.findOne({
      where: {
         stock_id: stockId,
      },
   });
   return data;
}

async function createSearchFrequency(stockId: number) {
   await searchFrequency.create({
      stock_id: stockId,
      frequency: 1,
   });
}

module.exports = { readSearchList, updateSearchFrequency, readSearchFrequency, createSearchFrequency };

// async function readPostList(condition: ListCondition) {
//     if (condition.page && condition.limit) {
//       const offset: number = (condition.page - 1) * condition.limit;

//       const data = await post.findAll({
//         attributes: [
//           ["id", "게시글_id"],
//           ["title", "제목"],
//           ["hit", "조회수"],
//           ["createdAt", "작성일"],
//           [sequelize.col("user.name"), "작성자"],
//           [sequelize.fn("count", sequelize.col("like.id")), "좋아요 수"],
//         ],
//         include: [
//           {
//             model: user,
//             as: "user",
//             attributes: [],
//           },
//           {
//             model: like,
//             as: "like",
//             attributes: [],
//           },
//         ],
//         group: "post.id",
//         where: {
//           title: {
//             [Op.like]: "%" + condition.search + "%",
//           },
//         },
//         order: [[condition.orderBy, condition.order]],
//         offset: offset,
//         limit: condition.limit,
//         subQuery: false,
//         raw: true,
//       });
//       return data;
//     }
//   }
