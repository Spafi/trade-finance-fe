import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableHeaderComponent } from '~shared/components/table-header/table-header.component';
import { BaseTable, Column, ColumnType, Severity } from '~shared/directives/base-table.directive';
import { DateValuePipe } from '~shared/pipes/date-value.pipe';
import { TranslateValuePipe } from '~shared/pipes/translate-value.pipe';


@Component( {
                selector   : 'app-table[items][columns][title]',
                templateUrl: './table.component.html',
                standalone : true,
                imports    : [
                    TableModule,
                    InputTextModule,
                    FormsModule,
                    TableHeaderComponent,
                    ButtonModule,
                    RippleModule,
                    AsyncPipe,
                    TagModule,
                    SkeletonModule,
                    DateValuePipe,
                    ChipModule,
                    NgClass,
                    DropdownModule,
                    JsonPipe,
                    CalendarModule,
                    TooltipModule,
                    DialogModule,
                    TranslateValuePipe
                ]

            } )
export class TableComponent<T> extends BaseTable<T> implements OnChanges {

    @Input() title!: string;
    @Input() items!: T[];
    @Input() columns!: Column<T>[];
    @Input() hasActionsColumn = true;

    @Output() onViewClick = new EventEmitter<T>();

    protected readonly ColumnType = ColumnType;

    constructor(
        private cdr: ChangeDetectorRef
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {
        if( changes['isDialogVisible'] ) {
            this.cdr.detectChanges();
        }
    }

    override onViewButtonClick(rowItem: T): void {
        this.onViewClick.emit( rowItem as T );
    }

    protected getSeverity = (value: string, column: Column<T>): Severity =>
        column.enumFilterOptions?.find( column => column.value == value )?.severity
        ?? Severity.info;
}
