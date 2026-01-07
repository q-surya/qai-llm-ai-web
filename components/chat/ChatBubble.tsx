'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import type { Message } from '../../types';

interface ChatBubbleProps {
    message: Message;
    isLoading?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLoading = false }) => {
    const router = useRouter();
    const isUser = message.role === 'user';
    const isAI = message.role === 'ai';

    const handleClick = () => {
        if (isAI && message.apiResponse) {
            router.push(`/details/${message.id}`);
        }
    };

    // Don't render empty AI bubbles while loading
    if (isAI && isLoading && (!message.content || message.content.trim() === '')) {
        return null;
    }

    return (
        <Box
            display="flex"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
            mb={3}
            sx={{ width: '100%' }}
        >
            <Box
                onClick={handleClick}
                sx={{
                    maxWidth: { xs: '85%', sm: '80%' },
                    px: { xs: 2.5, md: 3 },
                    py: { xs: 1.5, md: 2 },
                    borderRadius: '1.5rem',
                    bgcolor: isUser ? '#6D5CFF' : '#1E0C34',
                    color: '#F2ECF8',
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    lineHeight: 1.6,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    border: isAI ? '1px solid' : 'none',
                    borderColor: isAI ? '#2B1348' : 'transparent',
                    cursor: isAI && !isLoading && message.apiResponse ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    '&:hover': isAI && !isLoading && message.apiResponse ? {
                        bgcolor: '#2B1348',
                        transform: 'translateY(-1px)',
                    } : {},
                }}
            >
                {isAI ? (
                    <Box
                        sx={{
                            color: '#F2ECF8',
                            '& p': {
                                margin: '0 0 0.75rem 0',
                                '&:last-child': {
                                    marginBottom: 0,
                                },
                            },
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                                margin: '0.5rem 0 0.75rem 0',
                                color: '#F2ECF8',
                                fontWeight: 600,
                                '&:first-of-type': {
                                    marginTop: 0,
                                },
                            },
                            '& h1': { fontSize: '1.5rem' },
                            '& h2': { fontSize: '1.3rem' },
                            '& h3': { fontSize: '1.1rem' },
                            '& ul, & ol': {
                                margin: '0.5rem 0',
                                paddingLeft: '1.5rem',
                            },
                            '& li': {
                                margin: '0.25rem 0',
                            },
                            '& code': {
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                padding: '0.2rem 0.4rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.9em',
                                fontFamily: 'monospace',
                            },
                            '& pre': {
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                overflow: 'auto',
                                margin: '0.75rem 0',
                                '& code': {
                                    backgroundColor: 'transparent',
                                    padding: 0,
                                },
                            },
                            '& blockquote': {
                                borderLeft: '3px solid #6D5CFF',
                                paddingLeft: '1rem',
                                margin: '0.75rem 0',
                                fontStyle: 'italic',
                                opacity: 0.9,
                            },
                            '& a': {
                                color: '#6D5CFF',
                                textDecoration: 'underline',
                            },
                            '& table': {
                                borderCollapse: 'collapse',
                                width: '100%',
                                margin: '0.75rem 0',
                            },
                            '& th, & td': {
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '0.5rem',
                            },
                            '& th': {
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            },
                            '& .katex': {
                                color: '#F2ECF8',
                            },
                            '& .katex .base': {
                                color: '#F2ECF8',
                            },
                        }}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            key={message.id}
                        >
                            {message.content || ''}
                        </ReactMarkdown>
                    </Box>
                ) : (
                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: '#F2ECF8'
                    }}
                >
                    {message.content}
                </Typography>
                )}
                {isAI && !isLoading && message.apiResponse && (
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{
                            mt: 1.5,
                            color: '#A090B0',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                        }}
                    >
                        💡 Click to view SQL details
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ChatBubble;
