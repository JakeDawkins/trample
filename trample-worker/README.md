# Cloudflare Workers OpenAPI 3.1

This is a Cloudflare Worker with OpenAPI 3.1 using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

This is an example project made to be used as a quick start into building OpenAPI compliant Workers that generates the
`openapi.json` schema automatically from code and validates the incoming request to the defined parameters or request body.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [chanfana documentation](https://chanfana.pages.dev/) and [Hono documentation](https://hono.dev/docs).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:8788/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.

## Database

The API uses a Cloudflare D1 database bound as `prod_trample` in `wrangler.jsonc`. The schema lives in `migrations/`, which is the source of truth. Don't edit the database directly.

Local data for `wrangler dev` is stored under `.wrangler/state/`.

### First-time setup

Apply all migrations to your local database:

```sh
npx wrangler d1 migrations apply prod_trample --local
```

### Changing the schema

1. Create a new migration file:

   ```sh
   npx wrangler d1 migrations create prod_trample <short_description>
   ```

2. Write the SQL in the generated `migrations/NNNN_<short_description>.sql`. Never edit a migration that has already been applied. Add a new one instead.
3. Apply it locally and test with `wrangler dev`:

   ```sh
   npx wrangler d1 migrations apply prod_trample --local
   ```

4. Apply it to production:

   ```sh
   npx wrangler d1 migrations apply prod_trample --remote
   ```

To see which migrations are pending, run `npx wrangler d1 migrations list prod_trample --local` (or `--remote`).

SQLite can't change a column's type or constraints with `ALTER TABLE`. To do that, create a new table, copy the rows over, drop the old table, and rename the new one.
