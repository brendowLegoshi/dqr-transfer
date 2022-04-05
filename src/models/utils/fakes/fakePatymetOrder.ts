import { CreatePaymentOrderResponse, PaymentOrderResponse } from "../../types/Settlement";

export const fakeCreatePaymentOrderResponse: CreatePaymentOrderResponse = {
    internalId: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45',
    status: "CREATED",
}

export const fakePaymentOrderResponse: PaymentOrderResponse = {
    internalId: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45',
    externalId: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45',
    status: "APPROVED",
    amount: 15.000,
    expectedOn: "04-04-2022"
}