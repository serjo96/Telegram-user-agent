import { SetMetadata } from '@nestjs/common';
import { ValidationOptions } from "~/common/custom-validations";

export const ValidationOption = (option: ValidationOptions) => SetMetadata('validationOption', option);
