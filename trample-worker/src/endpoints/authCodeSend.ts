import { OpenAPIRoute } from 'chanfana';
import { success, z } from 'zod';
import { type AppContext } from '../types';
import { Resend } from 'resend';

const CODES_PER_EMAIL_PER_HOUR_LIMIT = 5;
const CODES_PER_DEVICE_PER_HOUR_LIMIT = 5;
const RETRY_LIMIT_SECS = 180;
const RETRY_LIMIT_MS = RETRY_LIMIT_SECS * 1000;

export class AuthCodeSend extends OpenAPIRoute {
  schema = {
    tags: ['AuthCode'],
    summary: 'Sends an auth code to an email',
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              email: z.email(),
            }),
          },
        },
      },
    },
    responses: {
      '200': {
        description:
          'Confirms the email was sent to the provided email address',
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
    // don't want authed users here
    if (c.get('userId')) {
      return c.json({}, 400);
    }

    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    const email = data.body.email;
    let code;

    // check rate limit for codes
    // Create code
    // TODO -- index on createdad and email

    // TODO -- real values here
    const recentCodesForEmail = 2,
      recentCodesForDevice = 2,
      timeSinceLastAttempt = 200 * 1000;
    if (
      recentCodesForDevice >= CODES_PER_DEVICE_PER_HOUR_LIMIT ||
      recentCodesForEmail >= CODES_PER_EMAIL_PER_HOUR_LIMIT ||
      timeSinceLastAttempt < RETRY_LIMIT_MS
    ) {
      return c.json(
        {
          errorMessage: "Can't send",
        },
        401,
      );
    } else {
      code = (crypto.getRandomValues(new Uint32Array(1))[0] % 10000)
        .toString()
        .padStart(4, '0');
      // create code
    }

    // Send email
    const resend = new Resend(c.env.RESEND_API_KEY);
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'hello@playtrample.com',
      to: email,
      subject: 'Your Trample code is ' + code,
      // TODO -- move all copy out to a copy file
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222; font-size: 16px; line-height: 1.5; max-width: 480px; margin: 0 auto; padding: 24px;">
        <p style="margin: 0 0 16px;">Hello from Trample</p>
        <p style="margin: 0 0 16px;">Your sign-in code is below:</p>
        <p style="margin: 0 0 24px; font-size: 32px; font-weight: bold; letter-spacing: 6px;">${code}</p>
        <p style="margin: 0; color: #666; font-size: 14px;">If you did not request this code, you can ignore this email.</p>
      </div>`,
    });

    if (resendError || !resendData) {
      return c.json({ errorMessage: 'Provider error' }, 500);
    }

    return c.json({}, 201);
  }
}
