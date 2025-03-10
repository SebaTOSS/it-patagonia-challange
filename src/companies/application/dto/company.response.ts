import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CompanyResponse {
    @Expose()
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @Expose()
    @ApiProperty({ example: '30-12345678-9' })
    cuit: string;

    @Expose()
    @ApiProperty({ example: 'Company S.A.' })
    name: string;

    @Expose()
    @ApiProperty({ type: Date, example: '2023-01-15' })
    adhesionDate: Date;

    @Expose()
    @ApiProperty({ type: Date, example: '2023-01-15' })
    createdAt: Date;

    @Expose()
    @ApiProperty({ type: Date, example: '2023-01-15' })
    updatedAt: Date;
}