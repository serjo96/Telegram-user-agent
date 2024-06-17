import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  project: {
    NODE_ENV: Joi.string().valid('development', 'production', 'staging', 'docker'),
    port: Joi.number().default(3000),
    sentryDsn: Joi.string(),
  },
  telegram: {
    telegramApiHash: Joi.string(),
    telegramApiId: Joi.number()
  }
});
