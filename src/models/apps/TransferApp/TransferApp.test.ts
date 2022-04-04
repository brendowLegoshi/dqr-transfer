import { TransferApp } from "./TransferApp";
import { Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-global";
import { Test } from "@nestjs/testing";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Logger } from "@nestjs/common";
import { fakeLogger, today, yesterday } from "../../utils/fakes/constants";
import { TransferModel } from "../../repository/contratcts";
import { transferCollection, TransferSchema } from "../../repository/schemas/TransferSchema";
import { fakeTransfer } from "../../utils/fakes/fakeTransfer";
import { Settlement } from "../../types/Settlement";
import { DqrSettlementService } from "../../service/DqrSettlementService";
import { fakePaymentOrderResponse } from "../../utils/fakes/fakePatymetOrder";

describe('catalog app', () => {
    let transferModel: Model<TransferModel>;
    let target: TransferApp;
    let dqrSettlementService: DqrSettlementService;

    beforeEach(async () => {

        dqrSettlementService = {
            paymentOrders: () => Promise.resolve(fakePaymentOrderResponse)
        } as unknown as DqrSettlementService;

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
            providers: [TransferApp, Logger, DqrSettlementService],
        })
            .overrideProvider(Logger)
            .useValue(fakeLogger)
            .overrideProvider(DqrSettlementService)
            .useValue(dqrSettlementService)
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

        it('should make bank settlement', async () => {
            jest.spyOn(dqrSettlementService, 'paymentOrders');

            const result = await target.transfer({...fakeTransfer, expectedOn: new Date()});

            const expectPaymentOrder: Settlement = {
                externalId: result.id,
                amount: result.value,
                expectedOn: result.expectedOn
            }

            expect(dqrSettlementService.paymentOrders).toHaveBeenCalledWith(expectPaymentOrder);
        });

        it('should verify expectedOn', async () => {
            jest.spyOn(dqrSettlementService, 'paymentOrders');

            await target.transfer({...fakeTransfer, expectedOn: yesterday});

            expect(dqrSettlementService.paymentOrders).not.toBeCalled();
        });
    })
})


