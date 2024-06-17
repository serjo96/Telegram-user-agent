import {  IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class StartAuthDto {

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;
}
