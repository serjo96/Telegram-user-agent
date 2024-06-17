import { Module } from '@nestjs/common';
import { TelegramController } from "~/telegram/telegram.controller";
import { TelegramService } from "~/telegram/telegram.service";

@Module({
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {}
