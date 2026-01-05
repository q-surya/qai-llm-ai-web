export interface AIResponse {
    keywords: string[];
    matched_tables: string[];
    related_tables: string[];
    matched_columns: Record<string, string[]>;
    is_query_generated: boolean;
    sql_query: string;
    sql_prompt: string;
    answer: string;
}

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: number;
    apiResponse?: AIResponse; // Only for AI messages
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}
