import { ApiProperty } from '@nestjs/swagger';

class TokenValidationPayload {
  @ApiProperty({
    description: 'Time before unlock next attempt in Unix time.',
  })
  unlockTime?: number;
}

export class TokenValidationErrorDto {
  @ApiProperty()
  message?: string;

  @ApiProperty()
  payload?: TokenValidationPayload;
}
