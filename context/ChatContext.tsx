import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, AIResponse } from '../types';
import { sendMessageToAI } from '../services/api';

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'quantara_chat_history';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    const sendMessage = async (content: string) => {
        setIsLoading(true);
        setError(null);

        const userMessage: Message = {
            id: uuidv4(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const response: AIResponse = await sendMessageToAI(content);

            console.log('API Response received:', response);

            const aiMessage: Message = {
                id: uuidv4(),
                role: 'ai',
                content: response.answer || "Received response but 'answer' field was empty. Click for details.",
                timestamp: Date.now(),
                apiResponse: response,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            // Optional: Add an error message to the chat
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        setMessages([]);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, isLoading, error, sendMessage, clearHistory }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext };
