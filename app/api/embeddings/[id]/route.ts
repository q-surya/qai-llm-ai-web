import { NextRequest } from 'next/server';
import http from 'http';
import { BACKEND_HOST, BACKEND_PORT } from '@/constants/backend';

async function proxyRequest(
  id: string,
  method: 'PATCH' | 'DELETE',
  body?: object
) {
  const bodyString = body ? JSON.stringify(body) : '';
  const path = `/v1/rag/${encodeURIComponent(id)}`;

  return new Promise<string>((resolve, reject) => {
    const options: http.RequestOptions = {
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (bodyString) {
      (options.headers as Record<string, string>)['Content-Length'] =
        String(Buffer.byteLength(bodyString));
    }

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseBody);
        } else {
          reject(new Error(`Backend returned ${res.statusCode}: ${responseBody}`));
        }
      });
    });
    req.on('error', reject);
    if (bodyString) req.write(bodyString);
    req.end();
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await proxyRequest(id, 'PATCH', body);
    const json = data ? JSON.parse(data) : {};
    return Response.json(json);
  } catch (error) {
    console.error('Embeddings update error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const data = await proxyRequest(id, 'DELETE', body);
    const json = data ? JSON.parse(data) : {};
    return Response.json(json);
  } catch (error) {
    console.error('Embeddings delete error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 500 }
    );
  }
}
