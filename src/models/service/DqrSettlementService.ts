import { Settlement, SettlementResponse } from "../types/Settlement";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DqrSettlementService {

    public paymentOrders = (paymentOrder: Settlement): Promise<SettlementResponse> => {
        return Promise.resolve({internalId: '', status: "CREATED"})
    }
}