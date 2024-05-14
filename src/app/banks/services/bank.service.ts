import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '~core/services/base.service';
import { environment } from '~environments/environment';
import { AccountDto } from '~public-contracts/dtos/account-dto';
import { BankApprovedTransactionDto } from '~public-contracts/dtos/bank-approved-transaction-dto';
import { BankDto } from '~public-contracts/dtos/bank-dto';
import { BankRejectionRequestDto } from '~public-contracts/dtos/bank-rejection-request-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';

@Injectable()
export class BankService extends BaseService {

    getBanks = () => this.getRequest<BankDto[]>( environment.backendRoutes.banks );

    getBankAccounts = (bankId: string) => this.getRequest<AccountDto[]>(
        [
            environment.backendRoutes.banks,
            bankId,
            'accounts'
        ].join( '/' ) );

    getBankActiveTransactions = (bankId: string) => this.getRequest<TransactionDto[]>(
        [
            environment.backendRoutes.banks,
            bankId,
            'transactions',
            'updatable'
        ].join( '/' ) );

    getBankTransactionHistory = (bankId: string) => this.getRequest<TransactionDto[]>(
        [
            environment.backendRoutes.banks,
            bankId,
            'transactions'
        ].join( '/' ) );

    approveTransaction = (bankApprovalRequest: BankApprovedTransactionDto) => this.postRequest<BankApprovedTransactionDto, TransactionDto>(
        [
            environment.backendRoutes.banks,
            'approve-transaction'
        ].join( '/' ), bankApprovalRequest );

    rejectTransaction = (bankRejectionRequest: BankRejectionRequestDto) => this.postRequest<BankRejectionRequestDto, TransactionDto>(
        [
            environment.backendRoutes.banks,
            'reject-transaction'
        ].join( '/' ), bankRejectionRequest );


    constructor(
        override readonly http: HttpClient
    ) {
        super( http );
    }
}
