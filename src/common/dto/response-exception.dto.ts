import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ResponseExceptionDto {
  @IsString()
  @ApiProperty()
  message: string;

  @IsNumber()
  @ApiProperty()
  status: number;
}

export class BadResponseDto extends ResponseExceptionDto {
  status = 400;
}

export class UnauthorizedResponseDto extends ResponseExceptionDto {
  status = 401;
}
