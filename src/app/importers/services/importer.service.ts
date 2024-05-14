import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '~core/services/base.service';
import { environment } from '~environments/environment';
import { CreateTransactionDto } from '~public-contracts/dtos/create-transaction-dto';
import { ImporterDto } from '~public-contracts/dtos/importer-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { UpdateTransactionDto } from '~public-contracts/dtos/update-transaction-dto';

@Injectable()
export class ImporterService extends BaseService {

    getImporters = () => this.getRequest<ImporterDto[]>( environment.backendRoutes.importers );

    getImporterActiveTransactions = (importerId: string) => this.getRequest<TransactionDto[]>(
        [
            environment.backendRoutes.importers,
            importerId,
            'transactions',
            'updatable'
        ].join( '/' ) );

    getImporterTransactionHistory = (importerId: string) => this.getRequest<TransactionDto[]>(
        [
            environment.backendRoutes.importers,
            importerId,
            'transactions'
        ].join( '/' ) );

    requestTransaction = (transaction: CreateTransactionDto) => this.postRequest<CreateTransactionDto, TransactionDto>(
        [ environment.backendRoutes.importers, 'request-transaction' ].join( '/' ),
        transaction );

    updateTransaction = (transaction: UpdateTransactionDto) => this.putRequest<UpdateTransactionDto, TransactionDto>(
        [ environment.backendRoutes.importers, 'update-transaction' ].join( '/' ),
        transaction );

    constructor(
        override readonly http: HttpClient
    ) {
        super( http );
    }
}
