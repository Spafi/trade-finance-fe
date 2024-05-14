import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '~core/services/base.service';
import { environment } from '~environments/environment';
import { ExporterApprovedTransactionDto } from '~public-contracts/dtos/exporter-approved-transaction-dto';
import { ExporterDto } from '~public-contracts/dtos/exporter-dto';
import { ExporterRejectionRequestDto } from '~public-contracts/dtos/exporter-rejection-request-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';

@Injectable()
export class ExporterService extends BaseService {

    getExporters = () => this.getRequest<ExporterDto[]>( environment.backendRoutes.exporters );

    getExporterActiveTransactions = (exporterId: string) => this.getRequest<TransactionDto[]>(
        [
            environment.backendRoutes.exporters,
            exporterId,
            'transactions',
            'updatable'
        ].join( '/' ) );

    getExporterTransactionHistory = (exporterId: string) => this.getRequest<TransactionDto[]>(
        [
            environment.backendRoutes.exporters,
            exporterId,
            'transactions'
        ].join( '/' ) );

    approveTransaction = (exporterApprovalRequest: ExporterApprovedTransactionDto) => this.postRequest<ExporterApprovedTransactionDto, TransactionDto>(
        [
            environment.backendRoutes.exporters,
            'approve-transaction'
        ].join( '/' ), exporterApprovalRequest );

    rejectTransaction = (exporterRejectionRequest: ExporterRejectionRequestDto) => this.postRequest<ExporterRejectionRequestDto, TransactionDto>(
        [
            environment.backendRoutes.exporters,
            'reject-transaction'
        ].join( '/' ), exporterRejectionRequest );

    constructor(
        override readonly http: HttpClient
    ) {
        super( http );
    }
}
