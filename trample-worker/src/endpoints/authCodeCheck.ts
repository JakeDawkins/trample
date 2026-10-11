import { OpenAPIRoute } from 'chanfana';
import { success, uuid, uuidv4, z } from 'zod';
import { type AppContext } from '../types';

const CODES_PER_EMAIL_PER_HOUR_LIMIT = 5;
const CODES_PER_DEVICE_PER_HOUR_LIMIT = 5;
const RETRY_LIMIT_SECS = 180;
const RETRY_LIMIT_MS = RETRY_LIMIT_SECS * 1000;

export class AuthCodeCheck extends OpenAPIRoute {
  schema = {
    tags: ['AuthCode'],
    summary: 'Checks and auth code and returns tokens if valid',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              email: z.email(),
              code: z.string().regex(/^[0-9]{4}$/),
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Confirms code is valid for the email given.',
        content: {
          'application/json': {
            schema: z.object({
              errorMessage: z.string().optional(),
              token: z.uuid(),
              // Maybe not needed
              refresh: z.uuid(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    const { email, code } = data.body;

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
          errorMessage: 'Unable to check',
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

    const { token, refresh } = { token: uuid(), refresh: uuid() };
    return c.json({ token, refresh }, 201);
  }
}
