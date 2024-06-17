import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CompleteAuthDto {

  @IsString()
  @ApiProperty()
  phoneCode: string;
}
