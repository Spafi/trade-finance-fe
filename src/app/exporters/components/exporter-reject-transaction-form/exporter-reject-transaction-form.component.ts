import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take, tap } from 'rxjs';
import { ExporterService } from '~app/exporters/services/exporter.service';
import { FormControlsTyped, FormFields, FormGroupTyped } from '~config/interfaces/form-group-types.interface';
import { AppMessageService } from '~core/services/app-message.service';
import { ExporterRejectionRequestDto } from '~public-contracts/dtos/exporter-rejection-request-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { PrimaryButtonComponent } from '~shared/components/buttons/primary-button/primary-button.component';
import { SelectInputComponent } from '~shared/components/form-inputs/dropdown-input/select-input.component';
import { TextInputComponent } from '~shared/components/form-inputs/text-input/text-input.component';
import { TextareaInputComponent } from '~shared/components/form-inputs/textarea-input/textarea-input.component';
import { BaseForm } from '~shared/directives/base-form.directive';

@Component( {
                selector   : 'app-exporter-reject-transaction-form[transaction]',
                templateUrl: './exporter-reject-transaction-form.component.html',
                standalone : true,
                imports    : [
                    ReactiveFormsModule,
                    TextInputComponent,
                    SelectInputComponent,
                    PrimaryButtonComponent,
                    TextareaInputComponent
                ]
            } )
export class ExporterRejectTransactionFormComponent extends BaseForm<ExporterRejectionRequestDto> implements OnInit {

    @Input() transaction!: TransactionDto;
    @Output() onSubmitSuccess = new EventEmitter<void>();

    form!: FormGroup<FormControlsTyped<ExporterRejectionRequestDto>>;

    constructor(
        readonly formBuilder: FormBuilder,
        private readonly exporterService: ExporterService,
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

        this.exporterService.rejectTransaction( this.form.getRawValue() )
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

    protected createForm(): FormGroupTyped<ExporterRejectionRequestDto> {
        const fields: FormFields<ExporterRejectionRequestDto> = {
            transactionId: [ this.transaction.id, [ Validators.required ] ],
            comments     : [ null ]
        };
        return this.formBuilder.nonNullable.group<ExporterRejectionRequestDto>( fields );
    }

    protected override formInstance(): FormGroupTyped<ExporterRejectionRequestDto> {
        return this.form;
    }
}
