export interface CreateTransferDTO {
   accountId: number;
   transferDate: Date;
   transferType: 'deposit' | 'withdrawal';
   amount: number;
   currency: 'krw' | 'usd';
   transferName: string;
}

export interface UpdateTransferDTO {
   accountId: number;
   transferId: number;
   transferDate: Date;
   amount: number;
   transferName: string;
}
