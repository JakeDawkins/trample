import { OpenAPIRoute } from 'chanfana';
import { success, z } from 'zod';
import { GameResult, type AppContext } from '../types';

export class ResultsSave extends OpenAPIRoute {
  schema = {
    tags: ['Results'],
    summary: 'Saves results for a multiple games',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              results: z.array(GameResult),
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Confirms the result was saved',
        content: {
          'application/json': {
            schema: z.object({
              errorMessage: z.string().optional(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    // const date = data.body.date;
    // const result = data.body.result;

    // check rate limit for saves, don't allow save of already-stored results

    return c.json({}, 200);
  }
}
