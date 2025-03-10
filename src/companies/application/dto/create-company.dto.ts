import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty({
        example: '30-12345678-9',
        description: 'CUIT in format XX-XXXXXXXX-X'
    })
    @IsString()
    @Matches(/^\d{2}-\d{8}-\d{1}$/, {
        message: 'Invalid CUIT format. Should be XX-XXXXXXXX-X'
    })
    cuit: string;

    @ApiProperty({
        example: 'Enterprise S.A.',
        description: 'Company name'
    })
    @IsString()
    @Length(3, 100)
    name: string;
}