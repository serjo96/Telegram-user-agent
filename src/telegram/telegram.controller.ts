import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";

import { TelegramService } from './telegram.service';
import {
  ApiCompleteAuthDocs,
  ApiSendFileDocs, ApiSendMessageDocs,
  ApiStartAuthDocs
} from "~/telegram/api-docs/api-telegram.docs";
import { SendMessageDto } from "~/telegram/dto/send-message.dto";
import { StartAuthDto } from "~/telegram/dto/start-auth.dto";
import { SendFileWithCaptionDto } from "~/telegram/dto/send-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CompleteAuthDto } from "~/telegram/dto/complete-auth.dto";

@ApiTags('Telegram')
@Controller('/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('auth/start/:sessionId')
  @ApiStartAuthDocs()
  async startAuthorization(@Param('sessionId') sessionId: string, @Body() body: StartAuthDto): Promise<string> {
    await this.telegramService.startAuthorization(sessionId, body.phoneNumber);
    return 'Authorization has begun, please complete the process using the code sent to your phone.';
  }

  @Post('auth/complete/:sessionId')
  @ApiCompleteAuthDocs()
  async completeAuthorization(@Param('sessionId') sessionId: string, @Body() body: CompleteAuthDto): Promise<string> {
    await this.telegramService.completeAuthorization(sessionId, body.phoneCode);
    return 'Auth process success.';
  }

  @Post('send/:sessionId')
  @ApiSendMessageDocs()
  async sendMessage(@Param('sessionId') sessionId: string, @Body() body: SendMessageDto): Promise<string> {
    await this.telegramService.sendMessage(sessionId, body.chatId, body.message);
    return 'Message send';
  }


  @Post('send-file/:sessionId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiSendFileDocs()
  async sendFile(
    @Body() body: SendFileWithCaptionDto,
    @Param('sessionId') sessionId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    await this.telegramService.sendFile(sessionId, body.chatId, file, body.caption);
    return 'File sent';
  }


  @Post('send-video-message/:sessionId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiSendFileDocs()
  async sendVideoMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: SendFileWithCaptionDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    await this.telegramService.sendVideoMessage(sessionId, body.chatId, file, body.caption);
    return 'Video message was success send';
  }

  @Post('status/:sessionId')
  getClientStatus(@Param('sessionId') sessionId: string): string {
    return this.telegramService.getClientStatus(sessionId);
  }

}
