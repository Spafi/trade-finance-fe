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
import { ExporterApproveTransactionFormComponent } from '~app/exporters/components/exporter-approve-transaction-form/exporter-approve-transaction-form.component';
import { ExporterRejectTransactionFormComponent } from '~app/exporters/components/exporter-reject-transaction-form/exporter-reject-transaction-form.component';
import { ExporterService } from '~app/exporters/services/exporter.service';
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

export interface ActiveExporterTransactionData {
    id: string;
    status: string;
    importerName: string;
    bankName: string;
    createdAt: Date;
}

@Component( {
                selector   : 'app-exporter-page',
                templateUrl: './exporter-page.component.html',
                standalone : true,
                imports    : [
                    DropdownModule,
                    NgIf,
                    TableComponent,
                    FormsModule,
                    ButtonModule,
                    RippleModule,
                    SuccessButtonComponent,
                    RejectButtonComponent,
                    FieldsetModule,
                    AsyncPipe,
                    TagModule,
                    TranslateValuePipe,
                    DatePipe,
                    DialogModule,
                    ExporterRejectTransactionFormComponent,
                    ExporterApproveTransactionFormComponent
                ],
                providers  : [
                    ExporterService,
                    AppMessageService,
                    ConfirmationService,
                    TransactionService
                ]
            } )
export class ExporterPageComponent implements OnInit {

    protected readonly getTransactionStatusTagSeverity = getTransactionStatusTagSeverity;

    selectedExporter: SelectItem | null = null;
    exporterSelectOptions: SelectItem[] = [];
    activeTransactions: ActiveExporterTransactionData[] = [];
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
    activeTableColumns: Column<ActiveExporterTransactionData>[] = [
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
            field                : 'bankName',
            label                : 'Bank',
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
        private readonly exporterService: ExporterService,
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
        this.getSelectedExporterData( this.selectedExporter?.value );
        this.hideApproveDialog();
    }

    onRejectSuccess() {
        this.getSelectedExporterData( this.selectedExporter?.value );
        this.hideRejectDialog();
    }

    private subscribeForBanks(): void {
        this.exporterService.getExporters()
            .pipe(
                take( 1 ),
                tap( exporters =>
                         this.exporterSelectOptions = exporters.map( (it): SelectItem => (
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

    setSelectedTransaction(transaction: ActiveExporterTransactionData) {
        this.transactionService.getTransaction( transaction.id )
            .pipe(
                take( 1 ),
                tap( transaction => this.selectedTransaction = transaction )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );

    }

    getSelectedExporterData(exporterId: string): void {
        if( !exporterId ) {
            return;
        }
        this.getExporterActiveTransactions( exporterId );
        this.getExporterTransactionHistory( exporterId );
        this.selectedTransaction = undefined;
    }

    getExporterActiveTransactions(exporterId: string): void {
        if( !exporterId ) {
            return;
        }

        this.exporterService.getExporterActiveTransactions( exporterId )
            .pipe(
                take( 1 ),
                tap( transactions => {
                    this.activeTransactions = transactions.map( (it): ActiveExporterTransactionData => (
                        {
                            id          : it.id,
                            status      : it.status,
                            importerName: it.importer.name,
                            bankName    : it.bank.name,
                            createdAt   : it.createdAt
                        }
                    ) );
                } )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    getExporterTransactionHistory(exporterId: string): void {
        if( !exporterId ) {
            return;
        }

        this.exporterService.getExporterTransactionHistory( exporterId )
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
