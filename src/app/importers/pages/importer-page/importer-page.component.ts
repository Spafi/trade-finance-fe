import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { take, tap } from 'rxjs';
import { ActiveBankTransactionData } from '~app/banks/pages/bank-page/bank-page.component';
import { BankService } from '~app/banks/services/bank.service';
import { ExporterService } from '~app/exporters/services/exporter.service';
import { CreateTransactionFormComponent } from '~app/importers/components/create-transaction-form/create-transaction-form.component';
import { UpdateTransactionFormComponent } from '~app/importers/components/update-transaction-form/update-transaction-form.component';
import { ImporterService } from '~app/importers/services/importer.service';
import { TransactionService } from '~app/transactions/services/transaction.service';
import { AppMessageService } from '~core/services/app-message.service';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { TransactionStatus } from '~public-contracts/enums/transaction-status-enum';
import { RejectButtonComponent } from '~shared/components/buttons/reject-button/reject-button.component';
import { SuccessButtonComponent } from '~shared/components/buttons/success-button/success-button.component';
import { TableComponent } from '~shared/components/table/table.component';
import { Column, ColumnType, Severity } from '~shared/directives/base-table.directive';
import { getTransactionStatusTagSeverity } from '~shared/functions/get-transaction-status-tag-severity';
import { TranslateValuePipe } from '~shared/pipes/translate-value.pipe';

export interface HistoryTransactionData {
    id: string;
    amount: number;
    unit: string;
    goodType: string;
    importerComments?: string;
    bankComments?: string;
    exporterComments?: string;
    status: string;
    tentativeDeliveryDate?: Date;
    netPrice?: number;
    vat?: number;
    importerName: string;
    exporterName: string;
    bankName: string;
    accountNumber: string;
    createdAt: Date;
}

export interface ActiveTransactionData {
    id: string;
    status: string;
    importerName: string;
    exporterName: string;
    bankName: string;
    accountNumber: string;
    createdAt: Date;
}

@Component( {
                selector       : 'app-importer-page',
                standalone     : true,
                templateUrl    : './importer-page.component.html',
                imports        : [
                    CreateTransactionFormComponent,
                    TableComponent,
                    DropdownModule,
                    AsyncPipe,
                    FormsModule,
                    NgIf,
                    UpdateTransactionFormComponent,
                    RejectButtonComponent,
                    SuccessButtonComponent,
                    TagModule,
                    TranslateValuePipe
                ],
                providers      : [
                    ConfirmationService,
                    ImporterService,
                    BankService,
                    ExporterService,
                    AppMessageService,
                    TransactionService
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ImporterPageComponent implements OnInit {

    protected readonly getTransactionStatusTagSeverity = getTransactionStatusTagSeverity;

    selectedImporter: SelectItem | null = null;
    importerSelectOptions!: SelectItem[];
    activeTransactions: ActiveTransactionData[] = [];
    historyTransactionData: HistoryTransactionData[] = [];
    selectedTransaction: TransactionDto | undefined;

    historyTableColumns: Column<HistoryTransactionData>[] = [
        {
            field           : 'id',
            label           : 'Id',
            type            : ColumnType.Text,
            hideTextOverflow: true
        },
        {
            field                : 'goodType',
            label                : 'Good Type',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'amount',
            label                : 'Amount',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'unit',
            label                : 'Unit',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'bankName',
            label                : 'Bank',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'accountNumber',
            label                : 'Account',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'exporterName',
            label                : 'Exporter',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'netPrice',
            label                : 'Net Price',
            type                 : ColumnType.Numeric,
            filterableAndSortable: true
        },
        {
            field: 'vat',
            label: 'VAT',
            type : ColumnType.Numeric
        },
        {
            field                : 'createdAt',
            label                : 'Created At',
            type                 : ColumnType.Date,
            filterableAndSortable: true
        },
        {
            field                : 'tentativeDeliveryDate',
            label                : 'Tentative Delivery Date',
            type                 : ColumnType.Date,
            filterableAndSortable: true
        },
        {
            field           : 'importerComments',
            label           : 'Importer Comments',
            type            : ColumnType.Text,
            hideTextOverflow: true
        },
        {
            field           : 'bankComments',
            label           : 'Bank Comments',
            type            : ColumnType.Text,
            hideTextOverflow: true
        },
        {
            field           : 'exporterComments',
            label           : 'Exporter Comments',
            type            : ColumnType.Text,
            hideTextOverflow: true
        },
        {
            field                : 'status',
            label                : 'Status',
            type                 : ColumnType.Enum,
            enumTranslationKey   : 'ENUM_LABELS.TransactionStatus',
            enumFilterOptions    : [
                { label: 'Requested', value: TransactionStatus.REQUESTED, severity: Severity.warning },
                { label: 'Approved By Bank', value: TransactionStatus.APPROVED_BY_BANK, severity: Severity.info },
                { label: 'Rejected By Bank', value: TransactionStatus.REJECTED_BY_BANK, severity: Severity.danger },
                {
                    label   : 'Approved By Exporter', value: TransactionStatus.APPROVED_BY_EXPORTER,
                    severity: Severity.success
                },
                {
                    label   : 'Approved By Exporter', value: TransactionStatus.REJECTED_BY_EXPORTER,
                    severity: Severity.danger
                }
            ],
            filterableAndSortable: true
        }
    ];
    activeTableColumns: Column<ActiveTransactionData>[] = [
        {
            field           : 'id',
            label           : 'Id',
            type            : ColumnType.Text,
            hideTextOverflow: true
        },
        {
            field                : 'bankName',
            label                : 'Bank',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'accountNumber',
            label                : 'Account',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'exporterName',
            label                : 'Exporter',
            type                 : ColumnType.Text,
            filterableAndSortable: true
        },
        {
            field                : 'status',
            label                : 'Status',
            type                 : ColumnType.Enum,
            enumTranslationKey   : 'ENUM_LABELS.TransactionStatus',
            enumFilterOptions    : [
                { label: 'Requested', value: TransactionStatus.REQUESTED, severity: Severity.warning },
                { label: 'Approved By Bank', value: TransactionStatus.APPROVED_BY_BANK, severity: Severity.info },
                { label: 'Rejected By Bank', value: TransactionStatus.REJECTED_BY_BANK, severity: Severity.danger },
                {
                    label   : 'Approved By Exporter', value: TransactionStatus.APPROVED_BY_EXPORTER,
                    severity: Severity.success
                },
                {
                    label   : 'Rejected By Exporter', value: TransactionStatus.REJECTED_BY_EXPORTER,
                    severity: Severity.danger
                }
            ],
            filterableAndSortable: true
        }
    ];

    constructor(
        private readonly importerService: ImporterService,
        private readonly transactionService: TransactionService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.subscribeForImporters();
    }

    private subscribeForImporters(): void {
        this.importerService.getImporters()
            .pipe(
                take( 1 ),
                tap( importers =>
                         this.importerSelectOptions = importers.map( (it): SelectItem => (
                             {
                                 label: it.name,
                                 value: it.id
                             }
                         ) ) )
            )
            .subscribe();
    }

    setSelectedTransaction(transaction: ActiveBankTransactionData) {
        this.transactionService.getTransaction( transaction.id )
            .pipe(
                take( 1 ),
                tap( transaction => this.selectedTransaction = transaction )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );

    }

    getSelectedImporterData(importerId: string): void {
        if( !importerId ) {
            return;
        }
        this.getImporterActiveTransactions( importerId );
        this.getImporterTransactionHistory( importerId );
        this.selectedTransaction = undefined;
    }

    getImporterActiveTransactions(importerId: string): void {
        this.importerService.getImporterActiveTransactions( importerId )
            .pipe(
                take( 1 ),
                tap( transactions =>
                         this.activeTransactions = transactions.map( (it): ActiveTransactionData => (
                             {
                                 id           : it.id,
                                 status       : it.status,
                                 importerName : it.importer.name,
                                 bankName     : it.bank.name,
                                 exporterName : it.exporter.name,
                                 accountNumber: it.account.accountNumber,
                                 createdAt    : it.createdAt
                             }
                         ) ) )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    getImporterTransactionHistory(importerId: string): void {
        if( !importerId ) {
            return;
        }
        this.importerService.getImporterTransactionHistory( importerId )
            .pipe(
                take( 1 ),
                tap( transactions =>
                         this.historyTransactionData = transactions.map( (it): HistoryTransactionData => (
                             {
                                 id                   : it.id,
                                 amount               : it.amount,
                                 unit                 : it.unit,
                                 goodType             : it.goodType,
                                 importerComments     : it.importerComments,
                                 bankComments         : it.bankComments,
                                 exporterComments     : it.exporterComments,
                                 status               : it.status,
                                 tentativeDeliveryDate: it.tentativeDeliveryDate,
                                 netPrice             : it.netPrice,
                                 vat                  : it.vat,
                                 importerName         : it.importer.name,
                                 exporterName         : it.exporter.name,
                                 bankName             : it.bank.name,
                                 accountNumber        : it.account.accountNumber,
                                 createdAt            : it.createdAt
                             }
                         ) ) )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

}
