export interface UpdateTransactionDto {
    id: string;
    amount: number;
    unit: string;
    goodType: string;
    email: string;
    phone: string;
    receivingAddress: string;
    importerComments: string;
    bankComments: string;
    exporterComments: string;
}
