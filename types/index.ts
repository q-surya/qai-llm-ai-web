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
    intent?: string;
    intent_reasoning?: string;
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
