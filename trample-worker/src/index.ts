import { fromHono } from 'chanfana';
import { Hono } from 'hono';

import { GameList } from './endpoints/gameList';
import { loadUser, requireAnon, requireAuth } from './utils/authBoundary';
import { AuthCodeCheck } from './endpoints/authCodeCheck';
import { AuthCodeSend } from './endpoints/authCodeSend';
import { AuthCodeRefresh } from './endpoints/authCodeRefresh';
import { ResultsSave } from './endpoints/resultsSave';
import { ResultsList } from './endpoints/resultsList';

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

// Auth loading
app.use(loadUser);

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: '/',
});

// Register OpenAPI endpoints
// openapi.delete("/api/tasks/:taskSlug", TaskDelete);
openapi.get('/api/games', GameList);

// Auth codes
app.use('/api/auth/codes', requireAnon);
openapi.post('/api/auth/codes', AuthCodeSend);
app.use('/api/auth/tokens', requireAnon);
openapi.post('/api/auth/tokens', AuthCodeCheck);
openapi.post('/api/auth/tokens/refresh ', AuthCodeRefresh);

// Game Results
// Apply requireauth to the results saving handler
app.use('/api/results', requireAuth);
openapi.post('/api/results', ResultsSave);
openapi.get('/api/results', ResultsList);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;
