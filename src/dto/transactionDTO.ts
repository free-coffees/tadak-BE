export interface createTransactionDTO {
   accountId: number;
   stockId: number;
   transactionDate: Date;
   transactionType: 'buy' | 'sell';
   quantity: number;
   price: number;
   currency: 'krw' | 'usd';
}
