import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';
import { type AppContext, GameResult } from '../types';

export class ResultsList extends OpenAPIRoute {
  schema = {
    tags: ['Results'],
    summary: 'List Results for past games for a single user',
    request: {
      query: z.object({
        page: z.number().default(0).describe('Page number'),
      }),
    },
    responses: {
      '200': {
        description: 'Returns a list of games, ordered by date.',
        content: {
          'application/json': {
            schema: z.object({
              results: z.array(GameResult),
              summary: z.object({
                streak: z.int(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated parameters
    const { page } = data.query;

    // Implement your own object list here

    return {
      results: [
        {
          date: '2026-10-11',
          score: 195,
          moves: 17,
          longestWord: 5,
        },
        {
          date: '2026-10-10',
          score: 19,
          moves: 2,
          longestWord: 4,
        },
        {
          date: '2026-10-09',
          score: 195,
          moves: 17,
          longestWord: 5,
        },
        {
          date: '2026-10-08',
          score: 19,
          moves: 2,
          longestWord: 4,
        },
      ],
      summary: {
        streak: 4,
      },
    };
  }
}
