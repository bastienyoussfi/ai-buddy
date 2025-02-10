import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  RABBITMQ_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('1d'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export default () => {
  try {
    const config = envSchema.parse(process.env);
    return {
      env: config.NODE_ENV,
      port: config.PORT,
      database: {
        url: config.DATABASE_URL,
      },
      redis: {
        url: config.REDIS_URL,
      },
      rabbitmq: {
        url: config.RABBITMQ_URL,
      },
      jwt: {
        secret: config.JWT_SECRET,
        expiresIn: config.JWT_EXPIRATION,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Configuration validation error: ${error.message}`);
    }
    throw error;
  }
};
