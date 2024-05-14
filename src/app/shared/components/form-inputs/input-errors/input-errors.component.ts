import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { isArray } from 'lodash-es';
import { TranslateValuePipe } from '~shared/pipes/translate-value.pipe';
import { valueIsEmpty } from '~shared/validations/is-empty.function';

@Component( {
                selector   : 'app-input-errors, [app-input-errors]',
                templateUrl: './input-errors.component.html',
                styleUrls  : [ './input-errors.component.scss' ],
                imports    : [
                    TranslateValuePipe,
                    AsyncPipe,
                    NgIf,
                    NgForOf
                ],
                standalone : true
            } )
export class InputErrorsComponent {

    @Input() errors?: string | string[];
    @Input() displayErrors?: boolean;

    get errorsToDisplay(): string[] {

        if( isArray( this.errors ) ) {
            return this.errors;
        }

        if( !valueIsEmpty( this.errors ) ) {
            return [ this.errors! ];
        }

        return [];

    }

}
