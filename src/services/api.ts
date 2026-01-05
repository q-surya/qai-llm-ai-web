import type { AIResponse } from '../types';


// Use proxy to avoid CORS issues in development
const API_Base_URL = ' ˀ/api';

export const sendMessageToAI = async (query: string): Promise<AIResponse> => {
    try {
        console.log('Sending request to API:', { query });

        const payload = { query };
        const payloadString = JSON.stringify(payload);

        console.log('Payload object:', payload);
        console.log('Payload stringified:', payloadString);
        console.log('Request URL:', `${API_Base_URL}/ai-assistant`);

        const response = await fetch(`${API_Base_URL}/ai-assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: payloadString,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API call failed with status: ${response.status} - ${errorText}`);
        }

        const data: AIResponse = await response.json();
        console.log('API response data:', data);
        return data;
    } catch (error) {
        console.error('Error sending message to AI:', error);
        throw error;
    }
};
