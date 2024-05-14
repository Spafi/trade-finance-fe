import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { defaultTo, isNil } from 'lodash-es';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

type IconPosition = 'left' | 'right';

@Component( {
                selector   : 'app-primary-button',
                templateUrl: './primary-button.component.html',
                styleUrls  : [ './primary-button.component.scss' ],
                imports    : [
                    ButtonModule,
                    RippleModule,
                    NgStyle
                ],
                standalone : true
            } )
export class PrimaryButtonComponent implements OnInit {

    @Input() label!: string;
    @Input() icon!: string;
    @Input() disabled!: boolean;
    @Input() iconPosition: IconPosition = 'left';
    @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

    constructor() {
        this.disabled = false;
    }

    ngOnInit(): void {

        if( isNil( this.label ) && isNil( this.icon ) ) {
            this.label = 'NO LABEL';
        }

        this.disabled = defaultTo( this.disabled, false );
    }

    onButtonClicked(): void {

        if( !this.disabled ) {
            this.onClick.emit();
        }
    }

}
