import { Injectable, Logger } from "@nestjs/common";
import { Transfer } from "../../types/Transfer";
import { transferCollection } from "../../repository/schemas/TransferSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TransferModel } from "../../repository/contratcts";
import { DqrSettlementService } from "../../service/DqrSettlementService";
import { Settlement, SettlementResponse } from "../../types/Settlement";
import { yesterday } from "../../utils/fakes/constants";

@Injectable()
export class TransferApp {
    private context = TransferApp.name;

    constructor(private logger: Logger,
                @InjectModel(transferCollection)
                private transferModel: Model<TransferModel>,
                private dqrSettlementService: DqrSettlementService
    ) {
    }

    public transfer = async (transfer: Transfer): Promise<Transfer> => {
        this.logger.debug('Transfer has been requested', this.context);
        this.logger.debug(JSON.stringify(transfer));

        const transferCreated = await this.transferModel.create(transfer).then(x => x.toObject());

        if (transfer.expectedOn > yesterday)
            await this.settlement(this.mapToPaymentOrder(transferCreated));

        return transferCreated;
    }

    private settlement = async (paymentOrder: Settlement): Promise<SettlementResponse> => {
        this.logger.debug('Settlement has been requested', this.context);
        this.logger.debug(JSON.stringify(paymentOrder));

        return this.dqrSettlementService.paymentOrders(paymentOrder);
    }

    private mapToPaymentOrder = (obj: Transfer): Settlement => {
        const {id, value, expectedOn} = obj;
        return {
            externalId: id,
            amount: value,
            expectedOn
        }
    }

}