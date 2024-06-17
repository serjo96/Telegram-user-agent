import { Injectable, Logger } from '@nestjs/common';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { ConfigService } from '@nestjs/config';
import { CustomFile } from 'telegram/client/uploads';
import { promises as fs } from 'fs';
import * as path from 'path';

import { TelegramConfig } from '~/config/telegram.config';
import { ConfigEnum } from '~/config/main-config';

interface ClientState {
  client: TelegramClient;
  phoneNumber: string;
  phoneCodeHash: string;
  stringSession?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private sessionsFilePath = path.resolve(__dirname, '../../sessions.json');
  private clients: Map<string, ClientState> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.loadSessions();
  }

  private createClient(): TelegramClient {
    const { telegramApiId, telegramApiHash } = this.configService.get<TelegramConfig>(ConfigEnum.TELEGRAM);
    const stringSession = new StringSession('');
    return new TelegramClient(stringSession, telegramApiId, telegramApiHash, { connectionRetries: 5 });
  }

  private async loadSessions(): Promise<void> {
    try {
      const sessions = await this.readSessionsFromFile();
      const { telegramApiId, telegramApiHash } = this.configService.get<TelegramConfig>(ConfigEnum.TELEGRAM);
      for (const sessionId in sessions) {
        const { phoneNumber, phoneCodeHash, stringSession } = sessions[sessionId];

        const client = new TelegramClient(new StringSession(stringSession), telegramApiId, telegramApiHash, {
          connectionRetries: 5,
        });
        this.clients.set(sessionId, { client, phoneNumber, phoneCodeHash });
        await this.initClient(client);
      }
      this.logger.log('Sessions loaded from file');
    } catch (error) {
      this.handleLoadSessionError(error);
    }
  }

  private async readSessionsFromFile(): Promise<ClientState[]> {
    const data = await fs.readFile(this.sessionsFilePath, 'utf8');
    return JSON.parse(data);
  }

  private handleLoadSessionError(error: any): void {
    if (error.code !== 'ENOENT') {
      this.logger.error('Error loading sessions from file', error);
    } else {
      this.logger.error('Sessions file not found', error);
    }
  }

  private async initClient(client: TelegramClient): Promise<void> {
    try {
      await client.connect();
      if (await client.checkAuthorization()) {
        this.logger.log(`Already authorized as ${client.session.save()}`);
        await this.listenForMessages(client);
      } else {
        this.logger.log('Not authorized. Please start the authorization process.');
      }
    } catch (error) {
      this.logger.error('Error during client initialization', error);
    }
  }

  private async saveSessions(): Promise<void> {
    const sessions = await this.getSessionData();
    await fs.writeFile(this.sessionsFilePath, JSON.stringify(sessions, null, 2), 'utf8');
    this.logger.log('Sessions saved to file');
  }

  private async getSessionData(): Promise<any> {
    const sessions: any = {};

    try {
      const existingData = await fs.readFile(this.sessionsFilePath, 'utf8');
      const existingSessions = JSON.parse(existingData);
      Object.assign(sessions, existingSessions);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error('Error reading existing sessions from file', error);
      }
    }

    this.clients.forEach((state, sessionId) => {
      sessions[sessionId] = {
        phoneNumber: state.phoneNumber,
        phoneCodeHash: state.phoneCodeHash,
        stringSession: state.client.session.save(),
      };
    });

    return sessions;
  }

  private async listenForMessages(client: TelegramClient): Promise<void> {
    client.addEventHandler((event: any) => {
      if (event instanceof Api.UpdateShortMessage) {
        const messageText = event.message;
        const fromId = event.userId;
        this.logger.log(`New message from ${fromId}: ${messageText}`);
      }
    });
  }

  async startAuthorization(sessionId: string, phoneNumber: string): Promise<string> {
    const client = this.createClient();
    await client.connect();
    const result = await this.sendCode(client, phoneNumber);

    if (result instanceof Api.auth.SentCode) {
      this.clients.set(sessionId, {
        client,
        phoneNumber,
        phoneCodeHash: result.phoneCodeHash,
      });
      return sessionId;
    } else {
      throw new Error('Error sending authorization code');
    }
  }

  private async sendCode(client: TelegramClient, phoneNumber: string): Promise<any> {
    const { telegramApiId, telegramApiHash } = this.configService.get<TelegramConfig>(ConfigEnum.TELEGRAM);
    return client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId: telegramApiId,
        apiHash: telegramApiHash,
        settings: new Api.CodeSettings({}),
      })
    );
  }

  async completeAuthorization(sessionId: string, phoneCode: string): Promise<void> {
    const state = this.clients.get(sessionId);

    if (!state) {
      throw new Error('Session not found');
    }

    await state.client.invoke(
      new Api.auth.SignIn({
        phoneNumber: state.phoneNumber,
        phoneCodeHash: state.phoneCodeHash,
        phoneCode,
      })
    );

    this.logger.log(`Successfully authorized as ${state.client.session.save()}`);
    await this.saveSessions();
    await this.listenForMessages(state.client);
  }

  async sendMessage(sessionId: string, chatId: string, message: string): Promise<void> {
    const state = this.clients.get(sessionId);
    if (!state) {
      throw new Error('Session not found');
    }
    await state.client.sendMessage(chatId, { message });
  }

  async sendFile(sessionId: string, chatId: string, file: Express.Multer.File, caption?: string): Promise<void> {
    const state = this.clients.get(sessionId);
    if (!state) {
      throw new Error('Session not found');
    }

    const customFile = new CustomFile(file.originalname, file.size, '', file.buffer);
    await state.client.sendFile(chatId, { file: customFile, caption });
  }

  async sendVideoMessage(sessionId: string, chatId: string, file: Express.Multer.File, caption?: string): Promise<void> {
    const state = this.clients.get(sessionId);
    if (!state) {
      throw new Error('Session not found');
    }

    const customFile = new CustomFile(file.originalname, file.size, '', file.buffer);
    const uploadedFile = await state.client.uploadFile({ file: customFile, workers: 1 });

    await state.client.invoke(
      new Api.messages.SendMedia({
        peer: chatId,
        media: new Api.InputMediaUploadedDocument({
          file: uploadedFile,
          mimeType: 'video/mp4',
          attributes: [
            new Api.DocumentAttributeVideo({
              duration: 60,
              w: 640,
              h: 640,
              roundMessage: true,
            }),
          ],
        }),
        message: caption || '',
      })
    );
  }

  getClientStatus(sessionId: string): string {
    return this.clients.has(sessionId) ? 'Connected' : 'Not Connected';
  }
}
