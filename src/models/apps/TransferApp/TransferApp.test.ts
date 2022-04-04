import { TransferApp } from "./TransferApp";
import { Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-global";
import { Test } from "@nestjs/testing";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Logger } from "@nestjs/common";
import { fakeLogger } from "../../utils/fakes/constants";
import { TransferModel } from "../../repository/contratcts";
import { transferCollection, TransferSchema } from "../../repository/schemas/TransferSchema";
import { fakeTransfer } from "../../utils/fakes/fakeTransfer";

describe('catalog app', () => {
    let transferModel: Model<TransferModel>;
    let target: TransferApp;

    beforeEach(async () => {
        const uri = await new MongoMemoryServer().getUri();

        const moduleFixture = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(uri),
                MongooseModule.forFeature([
                    {
                        name: transferCollection, schema: TransferSchema, collection: transferCollection
                    }
                ])
            ],
            providers: [TransferApp, Logger]
        })
            .overrideProvider(Logger)
            .useValue(fakeLogger)
            .compile();

        target = moduleFixture.get<TransferApp>(TransferApp);
        transferModel = moduleFixture.get<Model<TransferModel>>(getModelToken(transferCollection));
    });

    describe('make a transfer', () => {
        it('should make a transfer', async () => {
            const result = await target.transfer(fakeTransfer);
            const savedDb = await transferModel.findById(result.id);

            expect(savedDb.id).toBeDefined();
            expect(result.idAccountFrom).toBe(savedDb.idAccountFrom);
            expect(result.idAccountTo).toBe(savedDb.idAccountTo);
            expect(result.value).toBe(savedDb.value);
            expect(result.expectedOn).toStrictEqual(savedDb.expectedOn);
        });
    })
})