import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
  @IsString()
  @ApiProperty()
  chatId: string;

  @IsString()
  @ApiProperty()
  message: string;
}
