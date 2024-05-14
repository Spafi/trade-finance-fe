import { Directive } from '@angular/core';
import { FormGroupTyped } from '~config/interfaces/form-group-types.interface';

export interface AppError {
    field: string;
    code: string;
    defaultMessage: string;
}

@Directive()
export abstract class BaseForm<T> {

    protected abstract formInstance(): FormGroupTyped<T>;

    protected showFormFieldErrors(errors: AppError[]) {
        const formFields = Object.keys( this.formInstance()
                                            .getRawValue() );
        errors.forEach( err => {
            if( err.field && err.code && formFields.includes( err.field ) && this.formInstance()
                                                                                 .get( err.field ) ) {
                this.formInstance()
                    .get( err.field )!.setErrors( { [err.code]: err.defaultMessage } );
                this.formInstance()
                    .get( err.field )
                    ?.markAsTouched();
            }
        } );
    }

}
