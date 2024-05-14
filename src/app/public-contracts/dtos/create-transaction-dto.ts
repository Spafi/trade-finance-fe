export interface CreateTransactionDto {
    amount: number;
    unit: string;
    goodType: string;
    receivingAddress: string;
    email: string;
    phone: string;
    importerComments: string;
    importerId: string;
    bankId: string;
    exporterId: string;
    accountId: string;
}
