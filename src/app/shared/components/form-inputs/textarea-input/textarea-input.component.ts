import { NgClass } from '@angular/common';
import { Attribute, Component, Input, Optional, Self } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputWrapperComponent } from '~shared/components/form-inputs/input-wrapper/input-wrapper.component';
import { BaseFormField } from '~shared/directives/base-form-field.directive';

@Component( {
                selector   : 'app-textarea-input',
                templateUrl: './textarea-input.component.html',
                standalone : true,
                imports    : [
                    InputWrapperComponent,
                    InputTextareaModule,
                    FormsModule,
                    NgClass
                ]
            } )
export class TextareaInputComponent extends BaseFormField<string> {

    @Input() isLabelFloating: boolean = true;
    @Input() labelPosition: 'above' | 'below' = 'below';

    constructor(
        @Optional() @Self() public override controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }
}
