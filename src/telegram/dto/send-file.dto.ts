import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendFileWithCaptionDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  chatId: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
