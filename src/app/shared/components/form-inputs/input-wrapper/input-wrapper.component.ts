import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { defaultTo } from 'lodash-es';
import { InputErrorsComponent } from '~shared/components/form-inputs/input-errors/input-errors.component';

@Component( {
                selector   : 'app-input-wrapper,[app-input-wrapper]',
                templateUrl: './input-wrapper.component.html',
                styleUrls  : [ './input-wrapper.component.scss' ],
                imports    : [
                    NgClass,
                    NgIf,
                    InputErrorsComponent
                ],
                standalone : true
            } )
export class InputWrapperComponent implements OnInit {

    @Input() label?: string;
    @Input() required?: boolean;
    @Input() errors?: string | string[];
    @Input() touched!: boolean;
    @Input() valid!: boolean;
    @Input() disabled!: boolean;
    @Input() name!: string | number;
    @Input() helpText?: string;

    get iconClass(): 'invalid-icon' | 'valid-icon' | undefined {

        if( this.touched && this.valid ) {
            return 'valid-icon';
        }

        if( this.touched && !this.valid ) {
            return 'invalid-icon';
        }

        return;
    }

    get statusIcon(): 'pi pi-check' | 'pi pi-exclamation-circle' | '' {

        if( this.disabled ) {
            return '';
        }

        if( this.valid ) {
            return 'pi pi-check';
        }

        return 'pi pi-exclamation-circle';
    }

    ngOnInit(): void {
        this.required = defaultTo( this.required, false );
    }

}
