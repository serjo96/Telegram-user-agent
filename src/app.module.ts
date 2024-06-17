import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import pinoLoggerConfig from "~/config/pino-logger.config";
import { validationSchema } from "~/config/validation";
import { mainConfig } from "~/config/main-config";
import { TelegramModule } from "~/telegram/telegram.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mainConfig],
      isGlobal: true,
      validationSchema,
    }),
    LoggerModule.forRootAsync({
      useFactory: async () => pinoLoggerConfig,
    }),
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
