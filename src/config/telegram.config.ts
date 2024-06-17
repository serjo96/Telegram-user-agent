import config from "~/config/config";

export type TelegramConfig = {
  telegramApiId: number,
  telegramApiHash: string
};


export const telegramConfig = (): TelegramConfig => ({
  telegramApiHash: config.TELEGRAM_API_HASH,
  telegramApiId: Number(config.TELEGRAM_API_ID),
})
