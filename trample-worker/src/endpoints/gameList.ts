import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';
import { type AppContext, Game } from '../types';

export class GameList extends OpenAPIRoute {
  schema = {
    tags: ['Games'],
    summary: 'List Games',
    request: {
      query: z.object({
        page: z.number().default(0).describe('Page number'),
        isFuture: z
          .boolean()
          .optional()
          .default(true)
          .describe(
            'If true, lists matches in the future, date ASC. If false, shows past games, date DESC',
          ),
      }),
    },
    responses: {
      '200': {
        description: 'Returns a list of games, ordered by date.',
        content: {
          'application/json': {
            schema: z.object({
              games: Game.array(),
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
    const { page, isFuture } = data.query;

    // Implement your own object list here

    return {
      games: [
        {
          startingWord: 'BAT',
          date: '2026-10-11',
        },
        {
          startingWord: 'BOX',
          date: '2026-10-12',
        },
      ],
    };
  }
}
