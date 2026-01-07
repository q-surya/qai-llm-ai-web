import type { AIResponse } from '../types';
import { API_BASE_URL } from '../constants/api';

export const sendMessageToAI = async (
    query: string,
    streaming: boolean = true,
    onStreamChunk?: (chunk: string) => void
): Promise<AIResponse> => {
    try {
        console.log('Sending request to API:', { query, streaming });

        const payload = { query, streaming };
        const payloadString = JSON.stringify(payload);

        console.log('Payload object:', payload);
        console.log('Request URL:', `${API_BASE_URL}/ai-assistant`);

        const response = await fetch(`${API_BASE_URL}/ai-assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': streaming ? 'text/event-stream' : 'application/json',
            },
            body: payloadString,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API call failed with status: ${response.status} - ${errorText}`);
        }

        if (streaming && response.body) {
            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let accumulatedAnswer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;

                // Try to extract answer field from streaming JSON for display
                if (onStreamChunk) {
                    try {
                        // Try to find and extract the answer field value
                        // Handle both complete and partial JSON
                        const answerStart = fullResponse.indexOf('"answer"');
                        if (answerStart !== -1) {
                            // Find the start of the answer value
                            const valueStart = fullResponse.indexOf('"', answerStart + 8) + 1;
                            if (valueStart > 0) {
                                // Extract the answer value (handle escaped quotes and newlines)
                                let answerValue = '';
                                let i = valueStart;
                                let escaped = false;
                                
                                while (i < fullResponse.length) {
                                    const char = fullResponse[i];
                                    if (escaped) {
                                        if (char === 'n') answerValue += '\n';
                                        else if (char === 't') answerValue += '\t';
                                        else if (char === 'r') answerValue += '\r';
                                        else answerValue += char;
                                        escaped = false;
                                    } else if (char === '\\') {
                                        escaped = true;
                                    } else if (char === '"') {
                                        // End of string value
                                        break;
                                    } else {
                                        answerValue += char;
                                    }
                                    i++;
                                }
                                
                                // Only stream new content
                                if (answerValue.length > accumulatedAnswer.length) {
                                    const newChunk = answerValue.slice(accumulatedAnswer.length);
                                    accumulatedAnswer = answerValue;
                                    onStreamChunk(newChunk);
                                }
                            } else {
                                // Answer field found but value not started yet
                                onStreamChunk('');
                            }
                        } else {
                            // No answer field found yet, might be plain text response
                            // Stream the chunk as-is
                            onStreamChunk(chunk);
                        }
                    } catch {
                        // If parsing fails, stream the chunk directly
                        onStreamChunk(chunk);
                    }
                }
            }

            // Try to parse the full response as JSON
            try {
                const jsonData = JSON.parse(fullResponse.trim());
                console.log('API response data:', jsonData);
                return jsonData;
            } catch (parseError) {
                // Try to extract JSON from the response
                const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const jsonData = JSON.parse(jsonMatch[0]);
                        console.log('API response data (extracted):', jsonData);
                        return jsonData;
                    } catch {
                        // Fall through
                    }
                }
                // If it's not JSON, return a response with the text as answer
                return {
                    keywords: [],
                    matched_tables: [],
                    related_tables: [],
                    matched_columns: {},
                    is_query_generated: false,
                    sql_query: '',
                    sql_prompt: '',
                    answer: fullResponse.trim(),
                };
            }
        } else {
            // Non-streaming response
        const data: AIResponse = await response.json();
        console.log('API response data:', data);
        return data;
        }
    } catch (error) {
        console.error('Error sending message to AI:', error);
        throw error;
    }
};
