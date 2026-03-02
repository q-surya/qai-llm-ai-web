import { API_BASE_URL } from '@/constants/api';
import type {
  SchemaContextEmbedding,
  EmbeddingsListResponse,
} from '@/types';
import { SCHEMA_CONTEXT_TYPE } from '@/types';

const EMBEDDINGS_BASE = `${API_BASE_URL}/embeddings`;

function parseSearchResponse(data: unknown): SchemaContextEmbedding[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const obj = data as EmbeddingsListResponse;
    const items =
      obj.data ??
      obj.items ??
      obj.results ??
      (Array.isArray(obj) ? obj : []);
    if (Array.isArray(items)) return items;
    const firstArray = Object.values(obj).find((v) => Array.isArray(v)) as
      | SchemaContextEmbedding[]
      | undefined;
    return firstArray ?? [];
  }
  return [];
}

/** Search embeddings. Use empty query for initial load (returns all); with query returns results ordered by similarity. */
export async function searchSchemaContext(
  query: string,
  limit = 50
): Promise<SchemaContextEmbedding[]> {
  const res = await fetch(`${EMBEDDINGS_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query.trim(),
      type: SCHEMA_CONTEXT_TYPE,
      limit,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Search failed: ${res.status}`);
  }
  const data = await res.json();
  return parseSearchResponse(data);
}

export async function createSchemaContext(text: string): Promise<unknown> {
  const res = await fetch(`${EMBEDDINGS_BASE}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, type: SCHEMA_CONTEXT_TYPE }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Create failed: ${res.status}`);
  }
  return res.json();
}

export async function updateSchemaContext(
  id: string,
  text: string
): Promise<unknown> {
  const res = await fetch(`${EMBEDDINGS_BASE}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, type: SCHEMA_CONTEXT_TYPE }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Update failed: ${res.status}`);
  }
  return res.json();
}

export async function deleteSchemaContext(id: string): Promise<unknown> {
  const res = await fetch(`${EMBEDDINGS_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: SCHEMA_CONTEXT_TYPE }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Delete failed: ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
