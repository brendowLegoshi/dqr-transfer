import { Settlement, CreatePaymentOrderResponse, PaymentOrderResponse } from "../types/Settlement";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DqrSettlementService {

    public paymentOrders = (paymentOrder: Settlement): Promise<CreatePaymentOrderResponse> => {
        return Promise.resolve({internalId: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45', status: "CREATED"})
    }

    public getPaymentOrders = (idSettementId: string): Promise<PaymentOrderResponse> => {
        return Promise.resolve(
            {
                internalId: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45',
                externalId: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45',
                amount: 15.000,
                status: "APPROVED",
                expectedOn: "04-04-2022"
            })
    }
}