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
import { defaultTo } from 'lodash-es';
import { SelectItem } from 'primeng/api';
import { catchError, tap } from 'rxjs';
import { BankService } from '~app/banks/services/bank.service';
import { FormControlsTyped, FormFields, FormGroupTyped } from '~app/config/interfaces/form-group-types.interface';
import { ImporterService } from '~app/importers/services/importer.service';
import { AppMessageService } from '~core/services/app-message.service';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { UpdateTransactionDto } from '~public-contracts/dtos/update-transaction-dto';
import { PrimaryButtonComponent } from '~shared/components/buttons/primary-button/primary-button.component';
import { SelectInputComponent } from '~shared/components/form-inputs/dropdown-input/select-input.component';
import { NumberInputComponent } from '~shared/components/form-inputs/number-input/number-input.component';
import { TextInputComponent } from '~shared/components/form-inputs/text-input/text-input.component';
import { TextareaInputComponent } from '~shared/components/form-inputs/textarea-input/textarea-input.component';
import { BaseForm } from '~shared/directives/base-form.directive';

@Component( {
                selector       : 'app-update-transaction-form[initialValues]',
                templateUrl    : './update-transaction-form.component.html',
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
export class UpdateTransactionFormComponent extends BaseForm<UpdateTransactionDto> implements OnInit, OnChanges {

    @Input() initialValues!: TransactionDto;
    @Output() onSubmitSuccess = new EventEmitter<void>();

    accounts: SelectItem[] = [];

    form!: FormGroup<FormControlsTyped<UpdateTransactionDto>>;

    constructor(
        readonly formBuilder: FormBuilder,
        private readonly importerService: ImporterService,
        private readonly bankService: BankService,
        private readonly appMessageService: AppMessageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit(): void {
        this.form = this.createForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if( changes['initialValues'] && !changes['initialValues'].isFirstChange() ) {
            this.form = this.createForm();
        }
    }

    submit(): void {
        if( !this.form.valid ) {
            this.form.markAllAsTouched();
            return;
        }

        this.importerService.updateTransaction( this.form.getRawValue() )
            .pipe(
                tap( data => {
                    if( data ) {
                        this.appMessageService.showSuccessMessage( 'Transaction updated successfully.' );
                        this.onSubmitSuccess.emit();
                    }
                } ),
                catchError( async (err) => this.showFormFieldErrors( err.error.errors ) )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    protected createForm(): FormGroupTyped<UpdateTransactionDto> {
        const fields: FormFields<UpdateTransactionDto> = {
            id              : [ defaultTo( this.initialValues.id, null ), [ Validators.required ] ],
            amount          : [ defaultTo( this.initialValues.amount, null ), [ Validators.required ] ],
            unit            : [ defaultTo( this.initialValues.unit, null ), [ Validators.required ] ],
            goodType        : [ defaultTo( this.initialValues.goodType, null ), [ Validators.required ] ],
            email           : [ defaultTo( this.initialValues.email, null ) ],
            phone           : [ defaultTo( this.initialValues.phone, null ) ],
            receivingAddress: [ defaultTo( this.initialValues.receivingAddress, null ), [ Validators.required ] ],
            importerComments: [
                defaultTo( this.initialValues.importerComments, null ),
                [ Validators.maxLength( 2000 ) ]
            ],
            bankComments    : [
                defaultTo( this.initialValues.bankComments, null ),
                [ Validators.maxLength( 2000 ) ]
            ],
            exporterComments: [
                defaultTo( this.initialValues.exporterComments, null ),
                [ Validators.maxLength( 2000 ) ]
            ]
        };
        return this.formBuilder.nonNullable.group<UpdateTransactionDto>( fields );
    }

    protected override formInstance(): FormGroupTyped<UpdateTransactionDto> {
        return this.form;
    }
}
