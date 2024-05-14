import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take, tap } from 'rxjs';
import { BankService } from '~app/banks/services/bank.service';
import { FormControlsTyped, FormFields, FormGroupTyped } from '~app/config/interfaces/form-group-types.interface';
import { AppMessageService } from '~core/services/app-message.service';
import { BankRejectionRequestDto } from '~public-contracts/dtos/bank-rejection-request-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { PrimaryButtonComponent } from '~shared/components/buttons/primary-button/primary-button.component';
import { SelectInputComponent } from '~shared/components/form-inputs/dropdown-input/select-input.component';
import { TextInputComponent } from '~shared/components/form-inputs/text-input/text-input.component';
import { TextareaInputComponent } from '~shared/components/form-inputs/textarea-input/textarea-input.component';
import { BaseForm } from '~shared/directives/base-form.directive';

@Component( {
                selector   : 'app-bank-reject-transaction-form[transaction]',
                templateUrl: './bank-reject-transaction-form.component.html',
                standalone : true,
                imports    : [
                    ReactiveFormsModule,
                    TextInputComponent,
                    SelectInputComponent,
                    PrimaryButtonComponent,
                    TextareaInputComponent
                ]
            } )
export class BankRejectTransactionFormComponent extends BaseForm<BankRejectionRequestDto> implements OnInit {

    @Input() transaction!: TransactionDto;
    @Output() onSubmitSuccess = new EventEmitter<void>();

    form!: FormGroup<FormControlsTyped<BankRejectionRequestDto>>;

    constructor(
        readonly formBuilder: FormBuilder,
        private readonly bankService: BankService,
        private readonly appMessageService: AppMessageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit(): void {
        this.form = this.createForm();
    }

    submit(): void {
        if( !this.form.valid ) {
            this.form.markAllAsTouched();
            return;
        }

        this.bankService.rejectTransaction( this.form.getRawValue() )
            .pipe(
                take( 1 ),
                tap( data => {
                    if( data ) {
                        this.appMessageService.showSuccessMessage( 'Transaction rejected successfully.' );
                        this.form.reset();
                        this.onSubmitSuccess.emit();
                    }
                } )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    protected createForm(): FormGroupTyped<BankRejectionRequestDto> {
        const fields: FormFields<BankRejectionRequestDto> = {
            transactionId: [ this.transaction.id, [ Validators.required ] ],
            comments     : [ null ]
        };
        return this.formBuilder.nonNullable.group<BankRejectionRequestDto>( fields );
    }

    protected override formInstance(): FormGroupTyped<BankRejectionRequestDto> {
        return this.form;
    }
}
