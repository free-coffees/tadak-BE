export interface CreateTransferDTO {
   accountId: number;
   transferDate: Date;
   transferType: 'deposit' | 'withdrawal';
   amount: number;
   currency: 'krw' | 'usd';
}
