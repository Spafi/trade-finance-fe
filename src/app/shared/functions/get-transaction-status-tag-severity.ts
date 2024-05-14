import { TransactionStatus } from '~public-contracts/enums/transaction-status-enum';
import { Severity } from '~shared/directives/base-table.directive';

export const getTransactionStatusTagSeverity = (status: string): Severity => {
    const statusAsEnum = TransactionStatus[status as keyof typeof TransactionStatus];

    switch(statusAsEnum) {
        case TransactionStatus.REQUESTED:
            return Severity.warning;
        case TransactionStatus.REJECTED_BY_BANK:
        case TransactionStatus.REJECTED_BY_EXPORTER:
            return Severity.danger;
        case TransactionStatus.APPROVED_BY_BANK:
            return Severity.info;
        case TransactionStatus.APPROVED_BY_EXPORTER:
            return Severity.success;
    }
};
