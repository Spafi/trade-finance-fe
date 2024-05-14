import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { valueIsEmpty } from '~shared/validations/is-empty.function';

@Pipe( { standalone: true, name: 'translateValue' } )
export class TranslateValuePipe implements PipeTransform {

    constructor(private translator: TranslateService) {
    }

    transform(value: string, rootTranslationKey?: string): Observable<string> {

        if( valueIsEmpty( rootTranslationKey ) ) {
            return of( value );
        }

        return this.translator.get( `${ rootTranslationKey }.${ value }` );
    }
}
