import { NgClass } from '@angular/common';
import { Attribute, Component, Optional, Self } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputWrapperComponent } from '~shared/components/form-inputs/input-wrapper/input-wrapper.component';
import { BaseFormField } from '~shared/directives/base-form-field.directive';
import { valueIsEmpty } from '~shared/validations/is-empty.function';

@Component( {
                selector   : 'app-date-input',
                templateUrl: './date-input.component.html',
                standalone : true,
                imports    : [
                    InputWrapperComponent,
                    CalendarModule,
                    FormsModule,
                    NgClass
                ],
                styleUrls  : [ './date-input.component.scss' ]
            } )
export class DateInputComponent extends BaseFormField<Date | null> {

    constructor(
        @Optional() @Self() public override controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }

    override writeValue(value: any): void {
        if( typeof value === 'string' && !valueIsEmpty( value ) ) {
            this.value = new Date( value );
            return;
        }
        this.value = value;
    }

    clearValue(): void {
        this.onChange( null );
    }

}
