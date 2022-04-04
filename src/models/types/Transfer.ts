import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BasicTransfer {
    @ApiProperty({type: String, example: '2c2f26b5-4f35-45eb-84ba-d5e46437a181'})
    idAccountFrom: string;

    @ApiProperty({type: String, example: '2c2f26b5-4f35-45eb-84ba-d5e46437a181'})
    idAccountTo: string;

    @ApiProperty({type: Number, example: 15000.00})
    value: number;

    @Type(() => Date)
    @ApiPropertyOptional({
        type: String,
        format: 'date-time',
        example: '1992-05-05',
    })
    expectedOn?: Date;
}

export interface Transfer extends BasicTransfer {
    id?: string
}
