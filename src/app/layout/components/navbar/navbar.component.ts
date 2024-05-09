import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AppR } from '~config/constants/routes';


@Component( {
                selector       : 'app-navbar',
                templateUrl    : './navbar.component.html',
                standalone     : true,
                styleUrl       : './navbar.component.scss',
                imports        : [
                    MenubarModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class NavbarComponent {

    items: MenuItem[] = [
        {
            label: 'Importers',
            icon : 'pi pi-download',
            route: `/${ AppR.importers }`
        },
        {
            label: 'Banks',
            icon : 'pi pi-building',
            route: `/${ AppR.banks }`
        },
        {
            label: 'Exporters',
            icon : 'pi pi-upload',
            route: `/${ AppR.exporters }`
        }
    ];
}
