import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { transferCollection, TransferSchema } from "./models/repository/schemas/TransferSchema";
import { TransferController } from "./api/TranferController";
import { TransferApp } from "./models/apps/TransferApp/TransferApp";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.URL_DATABASE),
        MongooseModule.forFeature([
            {name: transferCollection, schema: TransferSchema, collection: transferCollection}
        ]),
    ],
    controllers: [TransferController],
    providers: [Logger, TransferApp],
})
export class AppModule {
}
