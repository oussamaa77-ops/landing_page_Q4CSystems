import app from "./app";

// Vercel calls the default export as a Node.js `(req, res)` handler; the
// original request path is kept, so the Express routes under /api still match.
export default app;
