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
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage after hydration
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    setMessages(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to parse saved messages:', e);
                }
            }
            setIsHydrated(true);
        }
    }, []);

    // Save to localStorage after hydration
    useEffect(() => {
        if (isHydrated && typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages, isHydrated]);

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
            const response: AIResponse = await sendMessageToAI(
                content,
                false // Disable streaming
            );

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
