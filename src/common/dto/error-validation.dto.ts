import { ApiProperty } from '@nestjs/swagger';
import { BadResponseDto } from '~/common/dto/response-exception.dto';

type ErrorObject = {
  [key: string]: {
    messages: string[];
    nested?: ErrorObject;
  };
};

class ValidationErrorDto extends BadResponseDto {
  @ApiProperty({
    example: {
      email: {
        messages: ['email must be an email'],
        nested: {
          messages: ['some error message for nested param.'],
        },
      },
      password: {
        messages: ['password must be longer than or equal to 6 characters'],
        nested: {
          messages: ['some error message for nested param.'],
        },
      },
    },
    type: 'object',
  })
  errors: ErrorObject;
}

// Factory for creating DTOs with custom error examples
function createValidationErrorDto(examples: ErrorObject): typeof ValidationErrorDto {
  class CustomValidationErrorDto extends ValidationErrorDto {
    @ApiProperty({
      example: examples,
      type: 'object',
    })
   declare errors: ErrorObject;
  }

  return CustomValidationErrorDto;
}

export const RegistrationValidationErrorDto = createValidationErrorDto({
  password: {
    messages: ['password too weak'],
  },
  email: {
    messages: ['email must be not empty'],
  },
});
