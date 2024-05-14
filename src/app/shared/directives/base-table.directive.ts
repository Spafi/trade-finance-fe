import { Directive } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DEFAULT_ITEMS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from '~config/constants/pagination.constants';

export enum ColumnType {
    Text    = 'text',
    Numeric = 'numeric',
    Date    = 'date',
    Boolean = 'boolean',
    Enum    = 'enum'
}

export interface EnumFilterOption extends SelectItem {
    severity?: Severity;
}

export interface Column<T> {
    field: keyof T & string;
    label: string;
    type: ColumnType;
    enumFilterOptions?: EnumFilterOption[];
    enumTranslationKey?: string;
    filterable?: boolean;
    sortable?: boolean;
    filterableAndSortable?: boolean;
    hidden?: boolean;
    hideTextOverflow?: boolean;
}

export enum Severity {
    primary = 'primary',
    success = 'success',
    info    = 'info',
    warning = 'warning',
    danger  = 'danger',
}

@Directive()
export abstract class BaseTable<T> {

    abstract get columns(): Column<T>[];

    abstract onViewButtonClick(item: T): void;

    get rowsPerPageOptions(): number[] {
        return ROWS_PER_PAGE_OPTIONS;
    }

    get itemsPerPage(): number {
        return DEFAULT_ITEMS_PER_PAGE;
    }

    get colSpan(): number {
        return this.columns.length + 1;
    }
}
