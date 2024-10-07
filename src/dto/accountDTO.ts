export interface CreateAccountRequest {
   accountName: string;
   securitiesCompanyId: number;
}

export interface UpdateAccountDTO {
   account_name?: string;
   securities_company_id?: number;
}

export interface CreateAccountInitialDataDTO {
   accountId: number;
   balanceKRW: number;
   balanceUSD: number;
   holdings: Holding[];
}

export interface Holding {
   stockId: number;
   quantity: number;
   averagePrice: number;
   currency: 'krw' | 'usd';
}
