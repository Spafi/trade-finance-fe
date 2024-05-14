import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ImporterService } from '~app/importers/services/importer.service';

import { routes } from './app.routes';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader( httpClient );
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideRouter( routes,
                       withComponentInputBinding(),
                       withPreloading( PreloadAllModules )
        ),
        importProvidersFrom(
            TranslateModule.forRoot( {
                                         loader: {
                                             provide   : TranslateLoader,
                                             useFactory: HttpLoaderFactory,
                                             deps      : [ HttpClient ]
                                         }
                                     } ),
            BrowserAnimationsModule
        ),
        { provide: ImporterService, useClass: ImporterService }
    ]
};
