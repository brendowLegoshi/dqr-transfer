import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { TransferApp } from "../models/apps/TransferApp/TransferApp";
import { TransferDto } from "../models/types/dto/TransferDto";
import { Transfer } from "../models/types/Transfer";
import { CreatePaymentOrderResponse } from "../models/types/Settlement";

@Controller()
export class TransferController {
    private context = TransferController.name;

    constructor(private logger: Logger, private app: TransferApp) {
    }

    @Post('/bankTransfer')
    @ApiResponse({status: 201, description: 'transfer created'})
    public transfer(@Body() transferDto: TransferDto): Promise<Transfer> {
        this.logger.debug('Make a transfer has requested', this.context);

        return this.app.transfer(transferDto);
    }

    @Get('/bankSettlement/:idTransfer')
    @ApiResponse({status: 200, description: 'get bank settlement'})
    public getBankSettlementService(@Param('idTransfer') idTransfer: string): Promise<CreatePaymentOrderResponse> {
        this.logger.debug('Get settlement by id transfer has requested', this.context);

        return this.app.getSettlementTransfer(idTransfer);
    }
}