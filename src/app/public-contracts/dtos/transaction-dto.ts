import { AccountDto } from '~public-contracts/dtos/account-dto';
import { BankDto } from '~public-contracts/dtos/bank-dto';
import { ExporterDto } from '~public-contracts/dtos/exporter-dto';
import { ImporterDto } from '~public-contracts/dtos/importer-dto';

export interface TransactionDto {
    id: string;
    amount: number;
    unit: string;
    goodType: string;
    email?: string;
    phone?: string;
    receivingAddress: string;
    importerComments?: string;
    bankComments?: string;
    exporterComments?: string;
    status: string;
    tentativeDeliveryDate?: Date;
    netPrice?: number;
    vat?: number;
    importer: ImporterDto;
    exporter: ExporterDto;
    bank: BankDto;
    account: AccountDto;
    createdAt: Date;
}
