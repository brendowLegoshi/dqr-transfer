export type StatusEnum = 'CREATED' | 'APPROVED' | 'SCHEDULED' | 'REJECTED';

export class Settlement {
    externalId: string;
    amount: number;
    expectedOn: Date
}

export class SettlementResponse {
    internalId: string;
    status: StatusEnum;
}