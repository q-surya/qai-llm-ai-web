import { NextRequest } from 'next/server';
import https from 'https';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, streaming = false } = body;
        const bodyString = JSON.stringify({ query, streaming });
        
        // If streaming is requested, create a ReadableStream
        if (streaming) {
            const stream = new ReadableStream({
                start(controller) {
                    const options = {
                        hostname: '98.92.195.205',
                        port: 8000,
                        path: '/v1/ai-assistant',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Content-Length': Buffer.byteLength(bodyString),
                        },
                        rejectUnauthorized: false,
                    };

                    const req = https.request(options, (res) => {
                        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                            res.on('data', (chunk) => {
                                controller.enqueue(new TextEncoder().encode(chunk));
                            });

                            res.on('end', () => {
                                controller.close();
                            });

                            res.on('error', (error) => {
                                console.error('Stream error:', error);
                                controller.error(error);
                            });
                        } else {
                            let errorData = '';
                            res.on('data', (chunk) => {
                                errorData += chunk.toString();
                            });
                            res.on('end', () => {
                                controller.error(new Error(`API call failed with status: ${res.statusCode} - ${errorData}`));
                            });
                        }
                    });

                    req.on('error', (error) => {
                        console.error('Error proxying request to AI API:', error);
                        controller.error(error);
                    });

                    req.write(bodyString);
                    req.end();
                },
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        // Non-streaming response (original behavior)
        return new Promise<Response>((resolve) => {
            const options = {
                hostname: '98.92.195.205',
                port: 8000,
                path: '/v1/ai-assistant',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Length': Buffer.byteLength(bodyString),
                },
                rejectUnauthorized: false,
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                            const jsonData = JSON.parse(data);
                            resolve(Response.json(jsonData));
                        } else {
                            resolve(
                                Response.json(
                                    { error: `API call failed with status: ${res.statusCode} - ${data}` },
                                    { status: res.statusCode || 500 }
                                )
                            );
                        }
                    } catch (parseError) {
                        resolve(
                            Response.json(
                                { error: 'Failed to parse response', details: data },
                                { status: 500 }
                            )
                        );
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Error proxying request to AI API:', error);
                resolve(
                    Response.json(
                        { error: error.message || 'An unknown error occurred' },
                        { status: 500 }
                    )
                );
            });

            req.write(bodyString);
            req.end();
        });
    } catch (error) {
        console.error('Error in API route:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}

