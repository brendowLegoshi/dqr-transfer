import { Injectable, Logger } from "@nestjs/common";
import { Transfer } from "../../types/Transfer";
import { transferCollection } from "../../repository/schemas/TransferSchema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TransferModel } from "../../repository/contratcts";

@Injectable()
export class TransferApp {
    private context = TransferApp.name;

    constructor(@InjectModel(transferCollection)
                private transferModel: Model<TransferModel>,
                private logger: Logger) {
    }

    public transfer = (transfer: Transfer): Promise<Transfer> => {
        this.logger.debug('Partial update has been requested.', this.context);
        this.logger.debug(JSON.stringify(transfer));

        return this.transferModel.create(transfer);
    }
}