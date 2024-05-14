import { Pipe } from '@angular/core';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT, DEFAULT_DATETIME_FORMAT } from '~config/constants/date-format.constants';
import { valueIsEmpty } from '~shared/validations/is-empty.function';

@Pipe( { standalone: true, name: 'dateValue' } )
export class DateValuePipe {

    transform(value: Date | string | number | null | undefined, dateOnly = false, format?: string): string {

        if( valueIsEmpty( value ) ) {
            return '-';
        }

        const formattedDate = dayjs( value )
            .format( format ?? dateOnly
                     ? DEFAULT_DATE_FORMAT
                     : DEFAULT_DATETIME_FORMAT );

        return valueIsEmpty( formattedDate )
               ? '-'
               : formattedDate;
    }
}
