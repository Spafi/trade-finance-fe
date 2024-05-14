import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { take, tap } from 'rxjs';
import { BankService } from '~app/banks/services/bank.service';
import { FormControlsTyped, FormFields, FormGroupTyped } from '~app/config/interfaces/form-group-types.interface';
import { AppMessageService } from '~core/services/app-message.service';
import { BankApprovedTransactionDto } from '~public-contracts/dtos/bank-approved-transaction-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { PrimaryButtonComponent } from '~shared/components/buttons/primary-button/primary-button.component';
import { SelectInputComponent } from '~shared/components/form-inputs/dropdown-input/select-input.component';
import { TextInputComponent } from '~shared/components/form-inputs/text-input/text-input.component';
import { TextareaInputComponent } from '~shared/components/form-inputs/textarea-input/textarea-input.component';
import { BaseForm } from '~shared/directives/base-form.directive';

@Component( {
                selector       : 'app-bank-approve-transaction-form[transaction]',
                templateUrl    : './bank-approve-transaction-form.component.html',
                standalone     : true,
                imports        : [
                    ReactiveFormsModule,
                    TextInputComponent,
                    SelectInputComponent,
                    PrimaryButtonComponent,
                    TextareaInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class BankApproveTransactionFormComponent extends BaseForm<BankApprovedTransactionDto> implements OnInit {

    @Input() transaction!: TransactionDto;
    @Output() onSubmitSuccess = new EventEmitter<void>();

    accounts: SelectItem[] = [];
    form!: FormGroup<FormControlsTyped<BankApprovedTransactionDto>>;

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
        this.getBankAccounts( this.transaction.bank.id );
    }

    submit(): void {
        if( !this.form.valid ) {
            this.form.markAllAsTouched();
            return;
        }

        this.bankService.approveTransaction( this.form.getRawValue() )
            .pipe(
                take( 1 ),
                tap( data => {
                    if( data ) {
                        this.appMessageService.showSuccessMessage( 'Transaction approved successfully.' );
                        this.form.reset();
                        this.onSubmitSuccess.emit();
                    }
                } )
            )
            .subscribe( () => {
                this.changeDetectorRef.detectChanges();
            } );
    }

    getBankAccounts(bankId: string): void {
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

    protected createForm(): FormGroupTyped<BankApprovedTransactionDto> {
        const fields: FormFields<BankApprovedTransactionDto> = {
            transactionId: [ this.transaction.id, [ Validators.required ] ],
            accountId    : [ this.transaction.account.id, [ Validators.required ] ],
            comments     : [ null ]

        };
        return this.formBuilder.nonNullable.group<BankApprovedTransactionDto>( fields );
    }

    protected override formInstance(): FormGroupTyped<BankApprovedTransactionDto> {
        return this.form;
    }
}
