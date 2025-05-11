import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const routes: FastifyPluginAsync = async route => {
  route.get('/', (request, reply) => {
    reply.send({
      message: 'Olá API de Controle Financeiro!',
    });
  });

  route.get('/hello', (request, reply) => {
    reply.send({
      hello: 'world',
    });
  });

  route.get('/example/:exampleId', (request, reply) => {
    const paramSchema = z
      .object({
        exampleId: z.string().uuid({ message: 'Invalid UUID' }),
      })
      .safeParse(request.params);

    if (!paramSchema.success) {
      return reply.code(400).send({ message: paramSchema.error.message });
    }

    reply.send({
      exampleId: paramSchema.data.exampleId,
    });
  });
};

export default routes;
