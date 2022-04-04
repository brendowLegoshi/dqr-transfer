import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { TransferApp } from "../models/apps/TransferApp/TransferApp";
import { TransferDto } from "../models/types/dto/TransferDto";
import { Transfer } from "../models/types/Transfer";

@Controller()
export class TransferController {
    private context = TransferController.name;

    constructor(private logger: Logger, private app: TransferApp) {
    }

    @Post()
    @ApiResponse({status: 201, description: 'transfer created'})
    public transfer(@Body() transferDto: TransferDto): Promise<Transfer> {
        this.logger.debug('Make a transfer has requested', this.context);

        return this.app.transfer(transferDto);
    }
}