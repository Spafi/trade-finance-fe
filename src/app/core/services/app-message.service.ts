import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable( { providedIn: 'root' } )
export class AppMessageService {

    constructor(
        private messageService: MessageService
    ) {
    }

    showSuccessMessage(message: string) {
        this.messageService.add( { severity: 'success', summary: 'Success', detail: message } );
    }

    showErrorMessage(message: string) {
        this.messageService.add( { severity: 'error', summary: 'Error', detail: message } );
    }
}
