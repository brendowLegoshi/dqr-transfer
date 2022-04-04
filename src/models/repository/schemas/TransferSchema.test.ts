import { TransferModel } from "../contratcts";
import { Model, connect, model, connection } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-global";
import { Transfer } from "../../types/Transfer";
import { dayAfterTomorrow } from "../../utils/fakes/constants";
import { transferCollection, TransferSchema } from "./TransferSchema";

describe('Transfer schema test', () => {
    let transferModel: Model<TransferModel>;

    beforeEach(async () => {
        const uri = await new MongoMemoryServer().getUri();
        await connect(uri, {
            useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true
        }, err => {
            if (!err) return;

            process.exit(1);
        });

        transferModel = model<TransferModel>(transferCollection, TransferSchema, transferCollection);
    });

    afterEach(() => connection.close());

    test('test mapping', async () => {
        const transferToMake: Transfer = {
            idAccountFrom: 'd3fbe94f-6f46-4418-bdcb-3788ba569b48',
            idAccountTo: '3788ba569b48-4418-d3fbe94f-6f46-bdcb',
            value: 15.000,
            expectedOn: dayAfterTomorrow
        };

        const validTransfer = new transferModel(transferToMake);
        const savedTransfer = await validTransfer.save();

        expect(savedTransfer.id).toBeDefined();
        expect(savedTransfer.idAccountFrom).toBe(transferToMake.idAccountFrom);
        expect(savedTransfer.idAccountTo).toBe(transferToMake.idAccountTo);
        expect(savedTransfer.value).toBe(15.000);
        expect(savedTransfer.expectedOn).toBe(dayAfterTomorrow);
    })
})