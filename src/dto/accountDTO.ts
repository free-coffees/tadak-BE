export interface updateAccountDTO {
   account_name?: string;
   securities_company_id?: number;
}

export interface createAccountInitialDataDTO {
   stockId: number;
   transactionDate: Date;
   quantity: number;
   averagePrice: number;
   currency: 'krw' | 'usd';
}
