import { TransferDto } from "../../types/dto/TransferDto";
import { Transfer } from "../../types/Transfer";
import { today, yesterday } from "./constants";

export const fakeTransferDto: TransferDto = {
    idAccountFrom: 'd3fbe94f-6f46-4418-bdcb-3788ba569b45',
    idAccountTo: 'eac4a35d-b173-4f25-95bf-a847ee8b1234',
    value: 15.000,
    expectedOn: yesterday
}

export const fakeTransfer: Transfer = {
    idAccountFrom: 'd3f6f46-be94f-6f46-4418-bdcb-3788ba569b45',
    idAccountTo: 'eac4a35d-b173-4f25-95bf-a847ee8b1234',
    value: 15.000,
    expectedOn: yesterday
}