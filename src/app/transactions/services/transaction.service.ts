import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '~core/services/base.service';
import { environment } from '~environments/environment';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';

@Injectable()
export class TransactionService extends BaseService {

    getTransaction = (transactionId: string) => this.getRequest<TransactionDto>(
        [
            environment.backendRoutes.transactions,
            transactionId
        ].join( '/' ) );

    constructor(
        override readonly http: HttpClient
    ) {
        super( http );
    }
}
