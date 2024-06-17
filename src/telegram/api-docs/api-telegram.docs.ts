// src/telegram/decorators/swagger-telegram.decorator.ts

import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StartAuthDto } from '~/telegram/dto/start-auth.dto';
import { CompleteAuthDto } from '~/telegram/dto/complete-auth.dto';
import { SendMessageDto } from "~/telegram/dto/send-message.dto";
import { SendFileWithCaptionDto } from "~/telegram/dto/send-file.dto";

export function ApiStartAuthDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Starts the Telegram authorization process' }),
    ApiOkResponse({ description: 'Authorization started, code sent to user.' }),
    ApiBody({ type: StartAuthDto }),
  );
}

export function ApiCompleteAuthDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Completes the Telegram authorization process' }),
    ApiOkResponse({ description: 'Authorization completed, user signed in.' }),
    ApiBody({ type: CompleteAuthDto }),
  );
}


export function ApiSendMessageDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Send a message to a Telegram chat' }),
    ApiOkResponse({ description: 'Message sent successfully.' }),
    ApiBody({ type: SendMessageDto })
  );
}

export function ApiSendFileDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Send a file to a Telegram chat' }),
    ApiOkResponse({ description: 'File sent successfully.' }),
    ApiBody({ type: SendFileWithCaptionDto })
  );
}
