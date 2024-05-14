import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { take, tap } from 'rxjs';
import { BankApproveTransactionFormComponent } from '~app/banks/components/bank-approve-transaction-form/bank-approve-transaction-form.component';
import { BankRejectTransactionFormComponent } from '~app/banks/components/bank-reject-transaction-form/bank-reject-transaction-form.component';
import { BankService } from '~app/banks/services/bank.service';
import { ExporterService } from '~app/exporters/services/exporter.service';
import { CreateTransactionFormComponent } from '~app/importers/components/create-transaction-form/create-transaction-form.component';
import { HistoryTransactionData } from '~app/importers/pages/importer-page/importer-page.component';
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

export interface ActiveBankTransactionData {
    id: string;
    status: string;
    importerName: string;
    exporterName: string;
    accountNumber: string;
    createdAt: Date;
}

@Component( {
                selector   : 'app-bank-page',
                templateUrl: './bank-page.component.html',
                standalone : true,
                imports    : [
                    DropdownModule,
                    NgIf,
                    TableComponent,
                    CreateTransactionFormComponent,
                    FormsModule,
                    BankApproveTransactionFormComponent,
                    BankRejectTransactionFormComponent,
                    ButtonModule,
                    RippleModule,
                    SuccessButtonComponent,
                    RejectButtonComponent,
                    FieldsetModule,
                    FieldsetModule,
                    FieldsetModule,
                    FieldsetModule,
                    FieldsetModule,
                    AsyncPipe,
                    TagModule,
                    TranslateValuePipe,
                    DatePipe,
                    DialogModule
                ],
                providers  : [
                    BankService,
                    ExporterService,
                    AppMessageService,
                    ConfirmationService,
                    TransactionService
                ]
            } )
export class BankPageComponent implements OnInit {

    protected readonly getTransactionStatusTagSeverity = getTransactionStatusTagSeverity;

    selectedBank: SelectItem | null = null;
    bankSelectOptions: SelectItem[] = [];
    activeTransactions: ActiveBankTransactionData[] = [];
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
            field                : 'importerName',
            label                : 'Importer',
            type                 : ColumnType.Text,
            filterableAndSortable: true
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
            field                : 'accountNumber',
            label                : 'Account NO',
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
                    label   : 'Rejected By Exporter', value: TransactionStatus.REJECTED_BY_EXPORTER,
                    severity: Severity.danger
                }
            ],
            filterableAndSortable: true
        }
    ];
    activeTableColumns: Column<ActiveBankTransactionData>[] = [
        {
            field           : 'id',
            label           : 'Id',
            type            : ColumnType.Text,
            hideTextOverflow: true
        },
        {
            field                : 'importerName',
            label                : 'Importer',
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

    isApproveDialogVisible = false;
    isRejectDialogVisible = false;


    constructor(
        private readonly bankService: BankService,
        private readonly transactionService: TransactionService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.subscribeForBanks();
    }

    showApproveModal() {
        this.isApproveDialogVisible = true;
    }

    showRejectModal() {
        this.isRejectDialogVisible = true;
    }

    hideApproveDialog() {
        this.isApproveDialogVisible = false;
    }

    hideRejectDialog() {
        this.isRejectDialogVisible = false;
    }

    onApproveSuccess() {
        this.getSelectedBankData( this.selectedBank?.value );
        this.hideApproveDialog();
    }

    onRejectSuccess() {
        this.getSelectedBankData( this.selectedBank?.value );
        this.hideRejectDialog();
    }

    private subscribeForBanks(): void {
        this.bankService.getBanks()
            .pipe(
                take( 1 ),
                tap( banks =>
                         this.bankSelectOptions = banks.map( (it): SelectItem => (
                             {
                                 label: it.name,
                                 value: it.id
                             }
                         ) ) )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
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

    getSelectedBankData(bankId: string): void {
        if( !bankId ) {
            return;
        }
        this.getBankActiveTransactions( bankId );
        this.getBankTransactionHistory( bankId );
        this.selectedTransaction = undefined;
    }

    getBankActiveTransactions(bankId: string): void {
        if( !bankId ) {
            return;
        }

        this.bankService.getBankActiveTransactions( bankId )
            .pipe(
                take( 1 ),
                tap( transactions => {
                    this.activeTransactions = transactions.map( (it): ActiveBankTransactionData => (
                        {
                            id           : it.id,
                            status       : it.status,
                            importerName : it.importer.name,
                            exporterName : it.exporter.name,
                            accountNumber: it.account.accountNumber,
                            createdAt    : it.createdAt
                        }
                    ) );
                } )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    getBankTransactionHistory(bankId: string): void {
        if( !bankId ) {
            return;
        }

        this.bankService.getBankTransactionHistory( bankId )
            .pipe(
                take( 1 ),
                tap( transactions => {
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
                    ) );
                } )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }
}
