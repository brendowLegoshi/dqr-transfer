export type StatusEnum = 'CREATED' | 'APPROVED' | 'SCHEDULED' | 'REJECTED';

export class Settlement {
    externalId: string;
    amount: number;
    expectedOn: string;
}

export class CreatePaymentOrderResponse {
    internalId: string;
    status: StatusEnum;
}

export class PaymentOrderResponse {
    internalId: string;
    externalId: string;
    status: StatusEnum;
    amount: number;
    expectedOn: string;
}