export interface CreateTransactionDTO {
   accountId: number;
   stockId: number;
   transactionDate: Date;
   transactionType: 'buy' | 'sell';
   quantity: number;
   price: number;
   currency: 'krw' | 'usd';
}
