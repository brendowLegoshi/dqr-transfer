import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { TransferApp } from "../models/apps/TransferApp/TransferApp";
import { fakeTransfer, fakeTransferDto } from "../models/utils/fakes/fakeTransfer";
import { TransferController } from "./TranferController";
import { dayAfterTomorrow, fakeLogger } from "../models/utils/fakes/constants";
import { TransferDto } from "../models/types/dto/TransferDto";

describe('Transfer controller', () => {
    let expressApp: INestApplication;
    let app: TransferApp;

    beforeEach(async () => {
        app = {
            transfer: () => Promise.resolve(fakeTransfer)
        } as unknown as TransferApp;

        const moduleFixture = await Test.createTestingModule({
            controllers: [TransferController],
            providers: [Logger, TransferApp]
        })
            .overrideProvider(Logger)
            .useValue(fakeLogger)
            .overrideProvider(TransferApp)
            .useValue(app)
            .compile();

        expressApp = moduleFixture.createNestApplication();
        expressApp.useGlobalPipes(new ValidationPipe({
            forbidUnknownValues: false
        }));
        await expressApp.init();
    });

    describe('post transfer', () => {
        it('should make a transfer', async () => {
            jest.spyOn(app, 'transfer');
            const expectTransferDto: TransferDto = {
                ...fakeTransferDto,
                expectedOn: dayAfterTomorrow
            }

            const agent = request(expressApp.getHttpServer());

            await agent.post('')
                .send(expectTransferDto)
                .expect(201);

            expect(app.transfer).toHaveBeenCalledWith(expectTransferDto);
        });
    })
})