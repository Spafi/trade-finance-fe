import { NgClass } from '@angular/common';
import { Attribute, Component, Optional, Self } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputWrapperComponent } from '~shared/components/form-inputs/input-wrapper/input-wrapper.component';
import { BaseFormField } from '~shared/directives/base-form-field.directive';

@Component( {
                selector   : 'app-number-input',
                templateUrl: './number-input.component.html',
                imports    : [
                    InputWrapperComponent,
                    FormsModule,
                    NgClass,
                    InputTextModule,
                    InputNumberModule
                ],
                standalone : true
            } )
export class NumberInputComponent extends BaseFormField<string> {

    constructor(
        @Optional() @Self() public override controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }


}
