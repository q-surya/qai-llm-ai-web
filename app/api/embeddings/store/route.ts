import { NextRequest } from 'next/server';
import https from 'https';
import { BACKEND_HOST, BACKEND_PORT } from '@/constants/backend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyString = JSON.stringify(body);

    const data = await new Promise<string>((resolve, reject) => {
      const options = {
        hostname: BACKEND_HOST,
        port: BACKEND_PORT,
        path: '/v1/rag/store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyString),
        },
        rejectUnauthorized: false,
      };

      const req = https.request(options, (res) => {
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
      req.write(bodyString);
      req.end();
    });

    const json = data ? JSON.parse(data) : {};
    return Response.json(json);
  } catch (error) {
    console.error('Embeddings store error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Create failed' },
      { status: 500 }
    );
  }
}
