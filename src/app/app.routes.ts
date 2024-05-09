import { Routes } from '@angular/router';
import { BankPageComponent } from '~app/banks/pages/bank-page/bank-page.component';
import { ExporterPageComponent } from '~app/exporters/pages/exporter-page/exporter-page.component';
import { ImporterPageComponent } from '~app/importers/pages/importer-page/importer-page.component';
import { AppR } from '~config/constants/routes';

export const routes: Routes = [
    {
        path     : AppR.importers,
        component: ImporterPageComponent
    },
    {
        path     : AppR.banks,
        component: BankPageComponent
    },
    {
        path     : AppR.exporters,
        component: ExporterPageComponent
    },
    {
        path      : '**',
        redirectTo: AppR.importers
    }
];
