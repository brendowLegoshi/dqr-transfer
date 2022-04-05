import { TransferApp } from "./TransferApp";
import { Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-global";
import { Test } from "@nestjs/testing";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Logger } from "@nestjs/common";
import { fakeLogger, yesterday } from "../../utils/fakes/constants";
import { TransferModel } from "../../repository/contratcts";
import { transferCollection, TransferSchema } from "../../repository/schemas/TransferSchema";
import { fakeTransfer } from "../../utils/fakes/fakeTransfer";
import { Settlement } from "../../types/Settlement";
import { DqrSettlementService } from "../../service/DqrSettlementService";
import { fakeCreatePaymentOrderResponse, fakePaymentOrderResponse } from "../../utils/fakes/fakePatymetOrder";

describe('transfer app', () => {
    let transferModel: Model<TransferModel>;
    let target: TransferApp;
    let dqrSettlementService: DqrSettlementService;

    beforeEach(async () => {

        dqrSettlementService = {
            paymentOrders: () => Promise.resolve(fakeCreatePaymentOrderResponse),
            getPaymentOrders: () => Promise.resolve(fakePaymentOrderResponse)
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

    describe('bank transfer', () => {
        it('should make transfer', async () => {

            const result = await target.transfer(fakeTransfer);
            const savedDb = await transferModel.findById(result.id);

            expect(savedDb.id).toBeDefined();
            expect(result.idAccountFrom).toBe(savedDb.idAccountFrom);
            expect(result.idAccountTo).toBe(savedDb.idAccountTo);
            expect(result.value).toBe(savedDb.value);
            expect(result.expectedOn).toStrictEqual(savedDb.expectedOn);
        });

        it('should make settlement', async () => {
            jest.spyOn(dqrSettlementService, 'paymentOrders');

            const result = await target.transfer({...fakeTransfer, expectedOn: new Date()});

            const expectPaymentOrder: Settlement = {
                externalId: result.id,
                amount: result.value,
                expectedOn: result.expectedOn.toISOString().split('T')[0]
            }

            expect(dqrSettlementService.paymentOrders).toHaveBeenCalledWith(expectPaymentOrder);
        });

        it('should verify expectedOn', async () => {
            jest.spyOn(dqrSettlementService, 'paymentOrders');

            await target.transfer({...fakeTransfer, expectedOn: yesterday});

            expect(dqrSettlementService.paymentOrders).not.toBeCalled();
        });
    })

    describe('transfer settlement', () => {
        it('should get settlement by id transfer', async () => {
            const idTransfer = 'd3f6f46-be94f-6f46-4418-bdcb-3788ba569b45';

            jest.spyOn(dqrSettlementService, 'getPaymentOrders')
                .mockImplementation(() => Promise.resolve({...fakePaymentOrderResponse, externalId: idTransfer}));

            const result = await target.getSettlementTransfer(idTransfer);

            expect(result.internalId).toBeDefined();
            expect(result.externalId).toBeDefined();
            expect(result.status).toBeDefined();
            expect(result.amount).toBeDefined();
            expect(result.expectedOn).toBeDefined();

            expect(dqrSettlementService.getPaymentOrders).toHaveBeenCalledWith(idTransfer);
        });
    })
})


