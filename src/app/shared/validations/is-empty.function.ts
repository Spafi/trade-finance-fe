import { isEmpty, isNil } from 'lodash-es';

export function valueIsEmpty<T>(value?: T | null | undefined): value is null | undefined {

    if( typeof value === 'number' ) {
        return isNil( value );
    }

    if( typeof value === 'boolean' ) {
        return false;
    }

    if( value instanceof Date ) {
        return false;
    }

    return isNil( value ) || isEmpty( value );
}
