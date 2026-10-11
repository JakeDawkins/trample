import { OpenAPIRoute } from 'chanfana';
import { success, uuid, uuidv4, z } from 'zod';
import { type AppContext } from '../types';

const CODES_PER_EMAIL_PER_HOUR_LIMIT = 5;
const CODES_PER_DEVICE_PER_HOUR_LIMIT = 5;
const RETRY_LIMIT_SECS = 180;
const RETRY_LIMIT_MS = RETRY_LIMIT_SECS * 1000;

export class AuthCodeRefresh extends OpenAPIRoute {
  schema = {
    tags: ['AuthCode'],
    summary: 'Refreshes auth token for a refresh token',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              email: z.email(),
              refreshToken: z.uuid(),
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Confirms token has been refreshed, returns token',
        content: {
          'application/json': {
            schema: z.object({
              errorMessage: z.string().optional(),
              token: z.uuid(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    const { refreshToken } = data.body;

    // check rate limit for codes
    // Create code
    // TODO -- index on createdad and email

    // TODO -- real values here
    const recentCodesForEmail = 2,
      recentCodesForDevice = 2,
      timeSinceLastAttempt = 500;
    if (
      recentCodesForDevice >= CODES_PER_DEVICE_PER_HOUR_LIMIT ||
      recentCodesForEmail >= CODES_PER_EMAIL_PER_HOUR_LIMIT ||
      timeSinceLastAttempt < RETRY_LIMIT_MS
    ) {
      return c.json(
        {
          errorMessage: 'Cant refresh',
        },
        401,
      );
    } else {
      // TODO -- check code
      const found = true;
      if (!found) {
        return c.json({ errorMessage: 'Not found' }, 404);
      }
    }

    const { token } = { token: uuid() };
    return c.json({ token }, 201);
  }
}
