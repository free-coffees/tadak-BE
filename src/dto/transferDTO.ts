export interface createTransferDTO {
   accountId: number;
   transferDate: Date;
   transferType: 'deposit' | 'withdrawl';
   amount: number;
   currency: 'krw' | 'usd';
}
