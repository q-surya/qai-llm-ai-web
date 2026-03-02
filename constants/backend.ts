// Backend API host for server-side proxy (embeddings, ai-assistant, etc.)
export const BACKEND_HOST = process.env.BACKEND_HOST ?? '3.239.78.220';
export const BACKEND_PORT = Number(process.env.BACKEND_PORT ?? 8000);
