export interface CreateExchangeDTO {
   accountId: number;
   exchangeDate: Date;
   fromCurrency: 'krw' | 'usd';
   toCurrency: 'krw' | 'usd';
   exchangeRate: number;
   amount: number;
}
