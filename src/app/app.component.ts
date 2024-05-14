import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavbarComponent } from '~app/layout/components/navbar/navbar.component';

@Component( {
                selector       : 'app-root',
                standalone     : true,
                templateUrl    : './app.component.html',
                imports        : [ RouterOutlet, NavbarComponent, ToastModule ],
                providers      : [ MessageService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class AppComponent {

    constructor(
        public translate: TranslateService
    ) {
        translate.addLangs( [ 'en' ] );
        translate.setDefaultLang( 'en' );
        translate.use( 'en' );
    }
}
