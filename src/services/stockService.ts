const axios = require("axios");

async function getTokenService() {
    const data = await axios({
        method: 'POST',
        url: 'https://openapi.koreainvestment.com:9443/oauth2/tokenP',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data: {
            grant_type: 'client_credentials',
            appkey: process.env.STOCK_KEY,
            appsecret: process.env.STOCK_SECRET_KEY,
        }
    })
    return data.data.access_token;
}

async function readKRCurrentPriceService(itemCode: string){
    const data = await axios({
        method: 'GET',
        url: 'https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price',
        headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImE1NWFmZTg0LTA4YzQtNDQwZS1hZGQ5LWFmYTUwOTNiYzEzOSIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcxOTk4NTE5MSwiaWF0IjoxNzE5ODk4NzkxLCJqdGkiOiJQU1dvRGtrNHpOZ0ppNTc2dFVVUWNiRlZCRlliZEUwcVFmdGsifQ.URNJ6W8Dd9kAWDMq0E94QJGanUFDM8mAemMbhKv7ftlgjwrVnBZ69TRwOctmXgl2z3CBBk7yJhTrd0NQBi_K9Q',
            appkey: process.env.STOCK_KEY,
            appsecret: process.env.STOCK_SECRET_KEY,
            tr_id: 'FHKST01010100',
        },
        params: {
            FID_COND_MRKT_DIV_CODE: 'J',
            FID_INPUT_ISCD: itemCode,
        }
    })
    //console.log(data.data.output);
    return data.data.output.stck_prpr;
}

async function readUSCurrentPriceService(itemCode: string){
    const data = await axios({
        method: 'GET',
        url: 'https://openapi.koreainvestment.com:9443/uapi/overseas-price/v1/quotations/price',
        headers:{
            'Content-Type': 'application/json; charset=UTF-8',
            authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImE1NWFmZTg0LTA4YzQtNDQwZS1hZGQ5LWFmYTUwOTNiYzEzOSIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcxOTk4NTE5MSwiaWF0IjoxNzE5ODk4NzkxLCJqdGkiOiJQU1dvRGtrNHpOZ0ppNTc2dFVVUWNiRlZCRlliZEUwcVFmdGsifQ.URNJ6W8Dd9kAWDMq0E94QJGanUFDM8mAemMbhKv7ftlgjwrVnBZ69TRwOctmXgl2z3CBBk7yJhTrd0NQBi_K9Q',
            appkey: process.env.STOCK_KEY,
            appsecret: process.env.STOCK_SECRET_KEY,
            tr_id: 'HHDFS00000300',
        },
        params: {
            AUTH: '',
            EXCD: 'BAQ',
            SYMB: itemCode,
        }
    })
    //console.log(data.data.output);
    return data.data.output.last;
}


module.exports = {
  getTokenService,
  readKRCurrentPriceService,
  readUSCurrentPriceService
};
