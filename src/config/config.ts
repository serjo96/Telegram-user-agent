import { existsSync, readFileSync } from 'fs';
import * as dotenv from 'dotenv';

export type ConfigType = {

  PORT?: number;
  FRONTEND_HOST?: string;
  BASE_URL?: string;
  SENTRY_DSN?: string;

  TELEGRAM_API_ID?: string;
  TELEGRAM_API_HASH?: string;


};

let config = {} as ConfigType;
const envState = ['production', 'staging', 'development', 'docker'];
let envFile = '.env.development';

if (envState.includes(process.env.NODE_ENV)) {
  envFile = `.env.${process.env.NODE_ENV}`;
}

const envFileExists = existsSync(envFile);
if (envFileExists) {
  config = dotenv.parse(readFileSync(envFile));
}

config = { ...config, ...process.env };

export default config;
