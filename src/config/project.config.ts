import config from "~/config/config";

export type ProjectConfig = {
  port: number;
  frontendHost: string;
  baseHost: string;
  sentryDsn?: string;
};


export const projectConfig = (): ProjectConfig => ({
  port: +config.PORT || 3000,
  frontendHost: config.FRONTEND_HOST,
  baseHost: config.BASE_URL,
  sentryDsn: config.SENTRY_DSN,
})
