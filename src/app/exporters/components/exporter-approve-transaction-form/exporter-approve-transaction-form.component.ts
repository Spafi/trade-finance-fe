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
import { ExporterService } from '~app/exporters/services/exporter.service';
import { FormControlsTyped, FormFields, FormGroupTyped } from '~config/interfaces/form-group-types.interface';
import { AppMessageService } from '~core/services/app-message.service';
import { ExporterApprovedTransactionDto } from '~public-contracts/dtos/exporter-approved-transaction-dto';
import { TransactionDto } from '~public-contracts/dtos/transaction-dto';
import { PrimaryButtonComponent } from '~shared/components/buttons/primary-button/primary-button.component';
import { DateInputComponent } from '~shared/components/form-inputs/date-input/date-input.component';
import { SelectInputComponent } from '~shared/components/form-inputs/dropdown-input/select-input.component';
import { NumberInputComponent } from '~shared/components/form-inputs/number-input/number-input.component';
import { TextInputComponent } from '~shared/components/form-inputs/text-input/text-input.component';
import { TextareaInputComponent } from '~shared/components/form-inputs/textarea-input/textarea-input.component';
import { BaseForm } from '~shared/directives/base-form.directive';

@Component( {
                selector       : 'app-exporter-approve-transaction-form[transaction]',
                templateUrl    : './exporter-approve-transaction-form.component.html',
                standalone     : true,
                imports        : [
                    ReactiveFormsModule,
                    TextInputComponent,
                    SelectInputComponent,
                    PrimaryButtonComponent,
                    TextareaInputComponent,
                    DateInputComponent,
                    NumberInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ExporterApproveTransactionFormComponent extends BaseForm<ExporterApprovedTransactionDto> implements OnInit {

    @Input() transaction!: TransactionDto;
    @Output() onSubmitSuccess = new EventEmitter<void>();

    accounts: SelectItem[] = [];
    form!: FormGroup<FormControlsTyped<ExporterApprovedTransactionDto>>;

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

        this.exporterService.approveTransaction( this.form.getRawValue() )
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


    protected createForm(): FormGroupTyped<ExporterApprovedTransactionDto> {
        const fields: FormFields<ExporterApprovedTransactionDto> = {
            transactionId        : [ this.transaction.id, [ Validators.required ] ],
            netPrice             : [ null, [ Validators.required ] ],
            tentativeDeliveryDate: [ null, [ Validators.required ] ],
            comments             : [ null ]

        };
        return this.formBuilder.nonNullable.group<ExporterApprovedTransactionDto>( fields );
    }

    protected override formInstance(): FormGroupTyped<ExporterApprovedTransactionDto> {
        return this.form;
    }
}
