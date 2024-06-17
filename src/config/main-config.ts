import { projectConfig } from "~/config/project.config";
import { telegramConfig } from "~/config/telegram.config";

export const enum ConfigEnum {
  PROJECT = 'project',
  TELEGRAM = 'telegram'
}


export const mainConfig = () => ({
  project: {
    ...projectConfig()
  },
  telegram: {
    ...telegramConfig()
  }
});
