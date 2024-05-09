import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '~app/layout/components/navbar/navbar.component';

@Component( {
                selector       : 'app-root',
                standalone     : true,
                templateUrl    : './app.component.html',
                imports        : [ RouterOutlet, NavbarComponent ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class AppComponent {
}
