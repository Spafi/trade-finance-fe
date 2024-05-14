import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Column, ColumnType, Severity } from '~shared/directives/base-table.directive';
import { TranslateValuePipe } from '~shared/pipes/translate-value.pipe';


@Component( {
                selector       : 'app-table-header[columns][hasActionsColumn]',
                templateUrl    : './table-header.component.html',
                standalone     : true,
                imports        : [
                    TableModule,
                    DropdownModule,
                    FormsModule,
                    TagModule,
                    AsyncPipe,
                    TranslateValuePipe
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class TableHeaderComponent<T> implements OnInit {

    @Input() columns!: Column<T>[];
    @Input() hasActionsColumn: boolean = true;

    @ViewChild( 'templateHeaders', { static: true } ) template!: TemplateRef<any>;

    protected readonly ColumnType = ColumnType;
    protected readonly SeverityEnum = Severity;

    constructor(
        private viewContainerRef: ViewContainerRef
    ) {
    }

    ngOnInit(): void {
        this.viewContainerRef.createEmbeddedView( this.template );
    }
}
