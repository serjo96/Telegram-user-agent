import { Params } from 'nestjs-pino/params';
import { isProd, isStage } from '~/utils/envType';

const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};
export default {
  pinoHttp:
    isProd || isStage
      ? {
          formatters: {
            level: (label) => {
              return { level: label.toUpperCase() };
            },
            bindings: (bindings) => {
              return {
                host: bindings.hostname,
                node_version: process.version,
              };
            },
          },
          level: 'trace',
        }
      : {
          customLevels: levels, // our defined levels
          useOnlyCustomLevels: true,
          autoLogging: false,
          // level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          level: 'trace',
          formatters: {
            level: (label) => {
              return { level: label.toUpperCase() };
            },
            bindings: (bindings) => {
              return {
                host: bindings.hostname,
                node_version: process.version,
              };
            },
          },
          customProps: (req, res) => ({
            context: 'HTTP',
          }),
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              colorizeObjects: true,
              levelFirst: true,
              translateTime: 'yyyy-dd-mm, h:MM:ss TT',
            },
          },
        },
} as Params;
