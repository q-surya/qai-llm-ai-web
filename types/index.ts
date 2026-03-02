export interface WorkflowToken {
    name: string;
    input_tokens: number;
    output_tokens: number;
}

export interface NodeTiming {
    name: string;
    time_sec: number;
    success: boolean;
}

export interface AIResponse {
    is_query_generated: boolean;
    sql_query: string;
    sql_prompt: string;
    answer: string;
    summarized_intent?: string;
    technical_intent?: string;
    workflow_tokens?: WorkflowToken[];
    total_input_tokens?: number;
    total_output_tokens?: number;
    node_timings?: NodeTiming[];
    total_time_in_sec?: number;
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

export const SCHEMA_CONTEXT_TYPE = 'SCHEMA_CONTEXT';

export interface SchemaContextEmbedding {
    id: string;
    /** Display text from search/list API */
    content?: string;
    /** Used when creating/updating */
    text?: string;
    type?: string;
    /** Similarity score from search (null coalesce to 0 for display) */
    similarity?: number | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface EmbeddingsListResponse {
    data?: SchemaContextEmbedding[];
    items?: SchemaContextEmbedding[];
    results?: SchemaContextEmbedding[];
    [key: string]: unknown;
}
