import {
    Attribute,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Optional,
    Output,
    Self,
    SimpleChanges
} from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputWrapperComponent } from '~shared/components/form-inputs/input-wrapper/input-wrapper.component';
import { BaseFormField } from '~shared/directives/base-form-field.directive';

@Component( {
                selector   : 'app-select-input',
                templateUrl: './select-input.component.html',
                standalone : true,
                imports    : [
                    DropdownModule,
                    InputWrapperComponent,
                    FormsModule
                ]
            } )
export class SelectInputComponent extends BaseFormField<string | undefined> implements OnChanges {

    @Input() options!: SelectItem[];

    @Output() onOptionSelected = new EventEmitter<any>();

    constructor(
        @Optional() @Self() public override controlDir: NgControl,
        @Attribute( 'formControlName' ) public formControlName: string
    ) {
        super( controlDir );
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    handleOptionSelected(option: string | undefined) {
        this.onOptionSelected.emit( option );
        this.onChange( option );
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

}
