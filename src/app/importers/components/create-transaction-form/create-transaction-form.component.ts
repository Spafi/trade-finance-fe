import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { catchError, take, tap } from 'rxjs';
import { BankService } from '~app/banks/services/bank.service';
import { FormControlsTyped, FormFields, FormGroupTyped } from '~app/config/interfaces/form-group-types.interface';
import { ExporterService } from '~app/exporters/services/exporter.service';
import { ImporterService } from '~app/importers/services/importer.service';
import { AppMessageService } from '~core/services/app-message.service';
import { CreateTransactionDto } from '~public-contracts/dtos/create-transaction-dto';
import { PrimaryButtonComponent } from '~shared/components/buttons/primary-button/primary-button.component';
import { SelectInputComponent } from '~shared/components/form-inputs/dropdown-input/select-input.component';
import { NumberInputComponent } from '~shared/components/form-inputs/number-input/number-input.component';
import { TextInputComponent } from '~shared/components/form-inputs/text-input/text-input.component';
import { TextareaInputComponent } from '~shared/components/form-inputs/textarea-input/textarea-input.component';
import { BaseForm } from '~shared/directives/base-form.directive';

@Component( {
                selector       : 'app-create-transaction-form[importerId]',
                templateUrl    : './create-transaction-form.component.html',
                standalone     : true,
                imports        : [
                    ReactiveFormsModule,
                    TextInputComponent,
                    SelectInputComponent,
                    PrimaryButtonComponent,
                    TextareaInputComponent,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class CreateTransactionFormComponent extends BaseForm<CreateTransactionDto> implements OnInit, OnChanges {

    @Input() importerId!: string;
    @Output() onSubmitSuccess = new EventEmitter<void>();

    banks: SelectItem[] = [];
    accounts: SelectItem[] = [];
    exporters: SelectItem[] = [];
    isBankSelected = false;

    form!: FormGroup<FormControlsTyped<CreateTransactionDto>>;

    constructor(
        readonly formBuilder: FormBuilder,
        private readonly importerService: ImporterService,
        private readonly bankService: BankService,
        private readonly exporterService: ExporterService,
        private readonly appMessageService: AppMessageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit(): void {
        this.form = this.createForm();
        this.subscribeForBanks();
        this.subscribeForExporters();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if( changes['importerId'] && !changes['importerId'].isFirstChange() ) {
            this.updateImporterId( changes['importerId'].currentValue );
        }
    }

    submit(): void {
        if( !this.form.valid ) {
            this.form.markAllAsTouched();
            return;
        }

        this.importerService.requestTransaction( this.form.getRawValue() )
            .pipe(
                tap( data => {
                    if( data ) {
                        this.appMessageService.showSuccessMessage( 'Transaction requested successfully.' );
                        this.form.reset();
                        this.onSubmitSuccess.emit();
                    }
                } ),
                catchError( async (err) => this.showFormFieldErrors( err.error.errors ) )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    protected createForm(): FormGroupTyped<CreateTransactionDto> {
        const fields: FormFields<CreateTransactionDto> = {
            amount          : [ null, [ Validators.required ] ],
            unit            : [ null, [ Validators.required ] ],
            goodType        : [ null, [ Validators.required ] ],
            email           : [ null, [ Validators.required ] ],
            phone           : [ null, [ Validators.required ] ],
            receivingAddress: [ null, [ Validators.required ] ],
            importerComments: [ null, [ Validators.maxLength( 2000 ) ] ],
            importerId      : [ this.importerId, [ Validators.required ] ],
            bankId          : [ null, [ Validators.required ] ],
            exporterId      : [ null, [ Validators.required ] ],
            accountId       : [ { value: null, disabled: !this.isBankSelected }, [ Validators.required ] ]
        };
        return this.formBuilder.nonNullable.group<CreateTransactionDto>( fields );
    }

    protected override formInstance(): FormGroupTyped<CreateTransactionDto> {
        return this.form;
    }

    private subscribeForBanks(): void {
        this.bankService.getBanks()
            .pipe(
                take( 1 ),
                tap( banks =>
                         this.banks = banks.map( (it): SelectItem => (
                             {
                                 label: it.name,
                                 value: it.id
                             }
                         ) )
                )
            )
            .subscribe();
    }

    private subscribeForExporters(): void {
        this.exporterService.getExporters()
            .pipe(
                take( 1 ),
                tap( exporters =>
                         this.exporters = exporters.map( (it): SelectItem => (
                             {
                                 label: it.name,
                                 value: it.id
                             }
                         ) ) )
            )
            .subscribe();
    }

    private updateImporterId(newImporterId: string): void {
        this.form.patchValue( { importerId: newImporterId } );
    }

    getBankAccounts(bankId: string): void {
        this.form.get( 'accountId' )
            ?.reset();
        if( !bankId ) {
            this.form.get( 'accountId' )
                ?.disable();
            return;
        }

        this.isBankSelected = true;
        this.form.get( 'accountId' )
            ?.enable();
        this.bankService.getBankAccounts( bankId )
            .pipe(
                take( 1 ),
                tap( accounts =>
                         this.accounts = accounts.map( (it): SelectItem => (
                             {
                                 label: it.accountNumber,
                                 value: it.id
                             }
                         ) ) )
            )
            .subscribe();
    }
}
