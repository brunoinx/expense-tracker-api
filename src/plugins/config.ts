import 'dotenv/config';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Static, Type } from '@sinclair/typebox';
import Ajv from 'ajv';
import fastifyPlugin from 'fastify-plugin';
import fastifyPostgres from '@fastify/postgres';

export enum NodeEnv {
  development = 'development',
  test = 'test',
  production = 'production',
}

const ConfigSchema = Type.Object({
  NODE_ENV: Type.Enum(NodeEnv),
  LOG_LEVEL: Type.String(),
  API_HOST: Type.String(),
  API_PORT: Type.String(),
});

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async server => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error('.env file validation failed - ' + JSON.stringify(validate.errors, null, 2));
  }
  server.decorate('config', process.env as Config);
};

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

const postgresPlugin = fastifyPlugin(async fastify => {
  fastify.register(fastifyPostgres, {
    connectionString:
      process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/expense_tracker',
  });
});

export default fp(configPlugin);
export { postgresPlugin };
