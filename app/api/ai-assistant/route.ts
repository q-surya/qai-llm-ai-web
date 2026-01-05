import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const bodyString = JSON.stringify(body);
        
        return new Promise((resolve) => {
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
                // Accept self-signed certificates
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
                            resolve(NextResponse.json(jsonData));
                        } else {
                            resolve(
                                NextResponse.json(
                                    { error: `API call failed with status: ${res.statusCode} - ${data}` },
                                    { status: res.statusCode || 500 }
                                )
                            );
                        }
                    } catch (parseError) {
                        resolve(
                            NextResponse.json(
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
                    NextResponse.json(
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
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}

