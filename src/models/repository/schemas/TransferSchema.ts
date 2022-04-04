import { TransferModel } from "../contratcts";
import { schemaOptions } from "./mongoSchemaOptions";
import { Schema } from "mongoose"

export const transferCollection = 'transfer';

export const TransferSchema = new Schema<TransferModel>({
    idAccountFrom: {type: String, require: true},
    idAccountTo: {type: String, require: true},
    value: {type: Number, require: true},
    expectedOn: {type:Date, require: false},
}, schemaOptions)